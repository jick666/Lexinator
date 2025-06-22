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

const defaultManager = new PluginManager();

export function registerPlugin(plugin) {
  defaultManager.register(plugin);
}

export function clearPlugins() {
  defaultManager.clear();
}

export function getPlugins() {
  return defaultManager.getAll();
}

export { defaultManager as pluginManager };
