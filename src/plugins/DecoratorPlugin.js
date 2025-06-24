import { TSDecoratorReader } from './common/TSDecoratorReader.js';
import { createPlugin } from './pluginUtils.js';

export const DecoratorPlugin = createPlugin([TSDecoratorReader]);
