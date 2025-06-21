import { TSDecoratorReader } from './common/TSDecoratorReader.js';

export const DecoratorPlugin = {
  modes: { default: [TSDecoratorReader] },
  init() {
    // plugin hook for future engine tweaks
  }
};
