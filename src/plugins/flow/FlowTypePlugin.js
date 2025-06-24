// src/plugins/flow/FlowTypePlugin.js

import { createTypeAnnotationReader } from '../common/TypeAnnotationReader.js';
import { createPlugin } from '../pluginUtils.js';

/** Flow type-annotation reader (allows “?” in the annotation). */
export const FlowTypeAnnotationReader = createTypeAnnotationReader({
  allowQuestionMark: true
});

export const FlowTypePlugin = createPlugin([FlowTypeAnnotationReader]);
