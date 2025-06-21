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

  if (!stream.input.startsWith('module', stream.index)) return null;

  const savedPos = stream.getPosition();
  for (const ch of 'module') {
    if (stream.current() !== ch) {
      stream.setPosition(savedPos);
      return null;
    }
    stream.advance();
  }

  const next = stream.current();
  if (next !== '{' && !(/\s/.test(next))) {
    stream.setPosition(savedPos);
    return null;
  }

  while (!stream.eof() && /\s/.test(stream.current())) {
    stream.advance();
  }

  if (stream.current() !== '{') {
    stream.setPosition(savedPos);
    return null;
  }

  stream.advance();
  engine && engine.pushMode && engine.pushMode('module_block');
  engine.moduleBlockDepth = 0;
  const endPos = stream.getPosition();
  return factory('MODULE_BLOCK_START', 'module {', startPos, endPos);
}
