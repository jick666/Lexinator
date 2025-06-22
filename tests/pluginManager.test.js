import { PluginManager } from '../src/index.js';

test('PluginManager manages plugins independently', () => {
  const manager = new PluginManager();
  const plugin = {};
  manager.register(plugin);
  expect(manager.getAll()).toContain(plugin);
  manager.clear();
  expect(manager.getAll()).toHaveLength(0);
});
