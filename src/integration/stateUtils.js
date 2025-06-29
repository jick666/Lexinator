// src/integration/stateUtils.js

// Serialization helpers with 3 policies:
//   'full' (default) – keep whole source
//   'tail'           – keep only yet-to-lex tail
//   'none'           – keep no source (caller must supply it on restore)

function tokensToJSON(tokens) {
  return tokens.map(t => t.toJSON());
}

function tokensFromJSON(arr, Token) {
  return arr.map(t => new Token(t.type, t.value, t.start, t.end, t.sourceURL));
}

export function serializeEngine(engine) {
  return {
    stateStack:               [...engine.stateStack],
    buffer:                   tokensToJSON(engine.buffer),
    disableJsx:               engine.disableJsx,
    lastToken:                engine.lastToken ? engine.lastToken.toJSON() : null,
    errorRecovery:            engine.errorRecovery,
    validateUnicodeProperties:engine.validateUnicodeProperties,
    stateInput:               engine.stateInput
  };
}

export function deserializeEngine(engine, data, Token) {
  engine.stateStack = [...data.stateStack];
  engine.buffer = tokensFromJSON(data.buffer, Token);
  engine.disableJsx = data.disableJsx;
  engine.lastToken = data.lastToken
    ? tokensFromJSON([data.lastToken], Token)[0]
    : null;
  engine.errorRecovery            = data.errorRecovery;
  engine.validateUnicodeProperties= data.validateUnicodeProperties ?? false;
  engine.stateInput               = data.stateInput               ?? 'full';
}

export function saveState(instance, includeTrivia = false) {
  const { stream, engine } = instance;
  const policy = engine.stateInput ?? 'full';
  const pos    = stream.getPosition();

  const out = {
    sourceURL: stream.sourceURL,
    position:  pos,
    tokens:    tokensToJSON(instance.tokens),
    ...(includeTrivia ? { trivia: tokensToJSON(instance.trivia) } : {}),
    engine:    serializeEngine(engine)
  };

  if (policy === 'full') {
    out.input = stream.input;
  } else if (policy === 'tail') {
    out.inputTail   = stream.input.slice(stream.index);
    out.baseOffset  = pos.index;
    out.baseLine    = pos.line;
    out.baseColumn  = pos.column;
  }
  /* policy 'none' – no text persisted */
  return out;
}

export function restoreState(instance,
                             state,
                             includeTrivia = false,
                             { input } = {}) {
  const { CharStream, LexerEngine, Token } = instance._deps;

  let stream;
  if (state.input !== undefined) {
    stream = new CharStream(state.input, { sourceURL: state.sourceURL });
    stream.setPosition(state.position);
  } else if (state.inputTail !== undefined) {
    stream = new CharStream(state.inputTail, {
      sourceURL:   state.sourceURL,
      baseOffset:  state.baseOffset,
      baseLine:    state.baseLine,
      baseColumn:  state.baseColumn
    });
    stream.setPosition(0);
  } else if (input !== undefined) {
    stream = new CharStream(input, { sourceURL: state.sourceURL });
    stream.setPosition(state.position);
  } else {
    throw new Error('restoreState: no source text available');
  }

  instance.stream = stream;

  instance.engine = new LexerEngine(stream, {
    errorRecovery:            state.engine.errorRecovery,
    validateUnicodeProperties:state.engine.validateUnicodeProperties,
    stateInput:               state.engine.stateInput
  });
  deserializeEngine(instance.engine, state.engine, Token);

  instance.tokens = tokensFromJSON(state.tokens, Token);
  if (includeTrivia) {
    instance.trivia = tokensFromJSON(state.trivia, Token);
  }
}
