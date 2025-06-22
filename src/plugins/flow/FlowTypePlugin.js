// src/plugins/flow/FlowTypePlugin.js

import { createTypeAnnotationReader } from '../common/TypeAnnotationReader.js';

/** Flow type-annotation reader (allows “?” in the annotation). */
export const FlowTypeAnnotationReader = createTypeAnnotationReader({
  allowQuestionMark: true
});

export const FlowTypePlugin = {
  // Declarative reader list (still appended so Flow can run without init())
  modes: { default: [FlowTypeAnnotationReader] },

  init(engine) {
    engine.addReaders('default', FlowTypeAnnotationReader);
  }
};
