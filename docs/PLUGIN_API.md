# Plugin API

The lexer supports runtime plugins that can register additional token readers.
A plugin is an object with an optional `modes` map and an `init` function.

```javascript
export function HashReader(stream, factory) {
  const start = stream.getPosition();
  if (stream.current() === '#') {
    stream.advance();
    return factory('HASH', '#', start, stream.getPosition());
  }
  return null;
}

export const HashPlugin = {
  modes: {
    default: [HashReader]
  },
  init(engine) {
    // custom setup logic
  }
};
```

Register the plugin before constructing a lexer:

```javascript
import { registerPlugin, tokenize } from 'experimental-js-lexer';
import { HashPlugin } from './hash-plugin.js';

registerPlugin(HashPlugin);
const tokens = tokenize('#');
```

Use `clearPlugins()` to remove all registered plugins, typically in tests.

## Example: TypeScript Decorators

Plugins can extend the lexer to handle TypeScript or Flow syntax. This example
adds support for decorator tokens beginning with `@`:

```javascript
export function TSDecoratorReader(stream, factory) {
  const pos = stream.getPosition();
  if (stream.current() !== '@') return null;
  let val = '@';
  stream.advance();
  while (stream.current() && /[A-Za-z0-9_$]/.test(stream.current())) {
    val += stream.current();
    stream.advance();
  }
  return factory('DECORATOR', val, pos, stream.getPosition());
}

export const TSDecoratorPlugin = {
  modes: { default: [TSDecoratorReader] },
  init(engine) {
    /* engine tweaks */
  }
};
```

Register the plugin in the same way:

```javascript
registerPlugin(TSDecoratorPlugin);
```

## TypeScript Plugin

The `TypeScriptPlugin` bundles readers for decorators, type annotations and
generic parameters. When registered it disables automatic JSX detection so
generics like `Map<string>` are tokenized correctly.

```javascript
import { TypeScriptPlugin } from './src/plugins/typescript/TypeScriptPlugin.js';

registerPlugin(TypeScriptPlugin);
```

## Flow Type Plugin

The `FlowTypePlugin` adds a reader for Flow-style type annotations. Unlike the TypeScript plugin it leaves JSX parsing enabled so Flow code can coexist with React components.

```javascript
import { FlowTypePlugin } from './src/plugins/flow/FlowTypePlugin.js';

registerPlugin(FlowTypePlugin);
```

## ImportMeta Plugin

The `ImportMetaPlugin` adds readers for the `import.meta` meta property and
simple dynamic `import()` calls.

```javascript
import { ImportMetaPlugin } from './src/plugins/importmeta/ImportMetaPlugin.js';

registerPlugin(ImportMetaPlugin);
```
