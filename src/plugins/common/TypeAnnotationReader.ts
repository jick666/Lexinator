export function createTypeAnnotationReader({ allowQuestionMark = false } = {}) {
  const pattern = allowQuestionMark
    ? /[A-Za-z0-9_<>,\s?]/
    : /[A-Za-z0-9_<>,\s]/;

  return function TypeAnnotationReader(stream, factory) {
    const start = stream.getPosition();
    if (stream.current() !== ':') return null;
    let value = ':';
    stream.advance();
    while (stream.current() && /\s/.test(stream.current())) {
      value += stream.current();
      stream.advance();
    }
    while (stream.current() && pattern.test(stream.current())) {
      if (/\n/.test(stream.current())) break;
      value += stream.current();
      stream.advance();
    }
    return factory('TYPE_ANNOTATION', value.trimEnd(), start, stream.getPosition());
  };
}
