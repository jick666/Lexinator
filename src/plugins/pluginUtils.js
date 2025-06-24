export function createPlugin(readers, extraInit) {
  return {
    modes: { default: readers },
    init(engine) {
      engine.addReaders('default', ...readers);
      if (typeof extraInit === 'function') extraInit(engine);
    }
  };
}
