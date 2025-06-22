export class PluginManager {
  constructor() {
    this.plugins = [];
  }

  register(plugin) {
    this.plugins.push(plugin);
  }

  clear() {
    this.plugins.length = 0;
  }

  getAll() {
    return [...this.plugins];
  }
}

export const globalPluginManager = new PluginManager();

export function registerPlugin(plugin) {
  globalPluginManager.register(plugin);
}

export function clearPlugins() {
  globalPluginManager.clear();
}

export function getPlugins() {
  return globalPluginManager.getAll();
}

export default globalPluginManager;
