export interface Plugin {
  /** Optional initialization hook allowing the plugin to modify the engine */
  init?(engine: unknown): void;
  /** Modes provided by the plugin */
  modes?: Record<string, unknown[]>;
}

const plugins: Plugin[] = [];

export function registerPlugin(plugin: Plugin): void {
  plugins.push(plugin);
}

export function clearPlugins(): void {
  plugins.length = 0;
}

export function getPlugins(): Plugin[] {
  return [...plugins];
}
