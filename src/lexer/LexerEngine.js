// ─── src/lexer/LexerEngine.js ───────────────────────────────────────────────
import { RegexOrDivideReader }    from './RegexOrDivideReader.js';
import { TemplateStringReader }   from './TemplateStringReader.js';
import { JSXReader }              from './JSXReader.js';
import { CommentReader }          from './CommentReader.js';
import { HTMLCommentReader }      from './HTMLCommentReader.js';
import { SourceMappingURLReader } from './SourceMappingURLReader.js';

import { baseReaders }            from './defaultReaders.js';
import { Token }                  from './Token.js';
import { LexerError }             from './LexerError.js';
import { JavaScriptGrammar }      from '../grammar/JavaScriptGrammar.js';
import { runReader }              from './TokenReader.js';
import { getPlugins }             from '../pluginManager.js';

/* ── fast-lookup tables ──────────────────────────────────────────────────── */
const SINGLE_CHAR_OPS = new Set(
  JavaScriptGrammar.operators.filter(op => op.length === 1)
);
const PIPE_OP        = '|>';
const PUNCTUATION_SET = JavaScriptGrammar.punctuationSet;

/* ═══════════════════════════════════════════════════════════════════════════
 *  LEXER ENGINE
 * ═════════════════════════════════════════════════════════════════════════ */
export class LexerEngine {

  constructor(
    stream,
    { errorRecovery=false, validateUnicodeProperties=false, stateInput='full' }={}
  ){
    this.stream   = stream;
    this.errorRecovery             = !!errorRecovery;
    this.validateUnicodeProperties = !!validateUnicodeProperties;
    this.stateInput                = stateInput;

    this.stateStack = ['default'];
    this.buffer     = [];
    this.disableJsx = false;
    this.lastToken  = null;

    this.triviaReaders = [HTMLCommentReader, SourceMappingURLReader, CommentReader];

    const shared = [...baseReaders];
    /** @type {Record<string, Function[]>} */
    this.modes = {
      default:         [...shared],
      do_block:        [...shared],
      module_block:    [...shared],
      template_string: [TemplateStringReader],
      regex:           [RegexOrDivideReader],
      jsx:             [JSXReader]
    };

    for(const pl of getPlugins()){
      if(pl.modes){
        for(const [m, rd] of Object.entries(pl.modes)) this.addReaders(m, ...rd);
      }
      if(typeof pl.init==='function') pl.init(this);
    }
  }

  /* ───────── mode helpers ───────── */
  currentMode(){ return this.stateStack[this.stateStack.length-1]; }
  pushMode(m){ this.stateStack.push(m); }
  popMode(){ if(this.stateStack.length>1) this.stateStack.pop(); }

  addReaders(mode, ...readers){
    if(!this.modes[mode]) this.modes[mode]=[];
    const list=this.modes[mode];
    for(let i=readers.length-1;i>=0;i--){
      const r=readers[i];
      const idx=list.indexOf(r);
      if(idx!==-1) list.splice(idx,1);
      list.unshift(r);
    }
  }

  /* ───────── trivia ───────── */
  _readTrivia(factory){
    for(const R of this.triviaReaders){
      const tok=runReader(R,this.stream,factory,this);
      if(tok) return tok;
    }
    return null;
  }

  /* ───────── utility: normalise operator tokens ───────── */
  _normaliseOperator(tok){
    if(tok.type!=='IDENTIFIER') return tok;

    // pure operator symbol that was mis-typed
    if(JavaScriptGrammar.operators.includes(tok.value)){
      tok.type = tok.value===PIPE_OP ? 'PIPELINE_OPERATOR' : 'OPERATOR';
      return tok;
    }

    // glued form like "=1"  or "|>b"
    for(const op of JavaScriptGrammar.sortedOperators){
      if(tok.value.startsWith(op)){
        const opType = op===PIPE_OP ? 'PIPELINE_OPERATOR' : 'OPERATOR';

        const { start } = tok;
        const mid = { ...start, column:start.column+op.length,
                                index:start.index+op.length };

        const opTok   = new Token(opType, op, start, mid, tok.sourceURL);
        const restVal = tok.value.slice(op.length);

        /* decide the remainder’s token-type heuristically */
        let restType = 'IDENTIFIER';
        if(/^[0-9]/.test(restVal))     restType = 'NUMBER';
        else if(restVal===';')         restType = 'PUNCTUATION';
        else if(JavaScriptGrammar.operators.includes(restVal))
          restType = restVal===PIPE_OP ? 'PIPELINE_OPERATOR' : 'OPERATOR';

        const tailTok = new Token(restType, restVal, mid, tok.end, tok.sourceURL);
        this.buffer.unshift(tailTok);          // emit after opTok on next pull
        return opTok;
      }
    }
    return tok;
  }

  /* ───────── inner loop ───────── */
  _readFromStream(){
    const { stream } = this;
    const factory = (type,val,s,e)=>new Token(type,val,s,e,stream.sourceURL);

    while(!stream.eof()){
      const triv=this._readTrivia(factory);
      if(triv){ this.lastToken=triv; return triv; }

      /* JSX heuristic */
      let mode=this.currentMode();
      if(mode==='default' && !this.disableJsx &&
         stream.current()==='<'
         && /[A-Za-z/!?]/.test(stream.peek()))
      {
        this.pushMode('jsx'); mode='jsx';
      }

      /* mode-specific readers */
      const readers=this.modes[mode]||this.modes.default;
      for(const R of readers){
        const res=runReader(R,stream,factory,this);
        if(!res) continue;

        if(res instanceof LexerError){
          if(this.errorRecovery){
            const { end }=res;
            stream.setPosition(end);
            if(end.index===res.start.index) stream.advance();
            const v=stream.input.slice(res.start.index,stream.index);
            const errTok=factory('ERROR_TOKEN',v,res.start,stream.getPosition());
            this.lastToken=errTok; return errTok;
          }
          throw res;
        }

        /* keyword upgrade */
        if(res.type==='IDENTIFIER' &&
           JavaScriptGrammar.keywordSet.has(res.value))
          res.type='KEYWORD';

        this.lastToken=res;
        return this._normaliseOperator(res);
      }

      /* single-char fallback */
      const ch=stream.current();
      if(ch!==null){
        if(PUNCTUATION_SET.has(ch)){
          const s=stream.getPosition(); stream.advance();
          const tok=factory('PUNCTUATION',ch,s,stream.getPosition());
          this.lastToken=tok; return tok;
        }
        if(SINGLE_CHAR_OPS.has(ch)){
          const s=stream.getPosition(); stream.advance();
          const tok=factory('OPERATOR',ch,s,stream.getPosition());
          this.lastToken=tok; return tok;
        }
      }
      stream.advance();                        // skip unknown rune
    }
    return null;                               // EOF
  }

  /* ───────── public API ───────── */
  nextToken(){
    if(this.buffer.length){
      this.lastToken=this.buffer.shift();
      return this.lastToken;
    }
    const t=this._readFromStream();
    this.lastToken=t;
    return t;
  }

  peek(n=1){
    while(this.buffer.length<n){
      const t=this._readFromStream();
      if(t===null) break;
      this.buffer.push(t);
    }
    return this.buffer[n-1]||null;
  }
}
