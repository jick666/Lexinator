import type { Plugin } from '../../pluginManager.js';
import { createTypeAnnotationReader } from '../common/TypeAnnotationReader.js';

/** Flow type-annotation reader (allows “?” in the annotation). */
export const FlowTypeAnnotationReader = createTypeAnnotationReader({
  allowQuestionMark: true
});

export const FlowTypePlugin: Plugin = {
  // Declarative reader list (still appended so Flow can run without init())
  modes: { default: [FlowTypeAnnotationReader] },

  init(engine: any) {
    engine.addReaders('default', FlowTypeAnnotationReader);
  }
};
