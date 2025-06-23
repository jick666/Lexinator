import type { Plugin } from '../pluginManager.js';
import { TSDecoratorReader } from './common/TSDecoratorReader.js';

export const DecoratorPlugin: Plugin = {
  modes: { default: [TSDecoratorReader] },
  init() {
    // plugin hook for future engine tweaks
  }
};
