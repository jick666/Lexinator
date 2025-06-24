import { consumeKeyword } from './utils.js';

export function ModuleBlockReader(stream, factory, engine) {
  const startPos = stream.getPosition();

  if (engine && engine.currentMode && engine.currentMode() === 'module_block') {
    if (stream.current() === '{') {
      engine.moduleBlockDepth = (engine.moduleBlockDepth || 0) + 1;
      return null;
    }
    if (stream.current() === '}') {
      if (engine.moduleBlockDepth > 0) {
        engine.moduleBlockDepth--;
        return null;
      }
      stream.advance();
      const endPos = stream.getPosition();
      engine.popMode();
      return factory('MODULE_BLOCK_END', '}', startPos, endPos);
    }
  }

  const kwEnd = consumeKeyword(stream, 'module');
  if (!kwEnd) return null;

  const next = stream.current();
  if (next !== '{' && !(/\s/.test(next))) {
    stream.setPosition(startPos);
    return null;
  }

  while (!stream.eof() && /\s/.test(stream.current())) {
    stream.advance();
  }

  if (stream.current() !== '{') {
    stream.setPosition(startPos);
    return null;
  }

  stream.advance();
  engine && engine.pushMode && engine.pushMode('module_block');
  engine.moduleBlockDepth = 0;
  const endPos = stream.getPosition();
  return factory('MODULE_BLOCK_START', 'module {', startPos, endPos);
}
