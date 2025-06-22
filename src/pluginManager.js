const plugins = [];

export function registerPlugin(plugin) {
  plugins.push(plugin);
}

export function clearPlugins() {
  plugins.length = 0;
}

export function getPlugins() {
  return [...plugins];
}
