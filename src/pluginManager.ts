const plugins: any[] = [];

export function registerPlugin(plugin: any): void {
  plugins.push(plugin);
}

export function clearPlugins(): void {
  plugins.length = 0;
}

export function getPlugins(): any[] {
  return [...plugins];
}
