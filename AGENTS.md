# AGENTS.md – Lexinator Contributor & Codex Guide
Last updated: 2025-06-22

## 🗺️  Project overview
Lexinator is a **modular JavaScript lexer / incremental tokeniser** built for
experimentation (JS stage-3 proposals, Flow, TypeScript etc.).  
Key folders:

| Folder | What lives here | Notes |
|--------|-----------------|-------|
| `src/lexer/` | Stateless, pure readers + engine | Each reader obeys `reader(stream, factory, engine?)` contract. |
| `src/integration/` | Stateful utilities (incremental, streams) | Safe for browser bundling. |
| `src/plugins/` | Optional language extensions | Enabled via `registerPlugin()`. |
| `tests/` | Jest & fuzzing suites | Must reach ≥ 90 % coverage (checked in CI). |

## 🔍  Where to change code
| Task | Touch these paths | Validation |
|------|------------------|------------|
| **Core lexing rule** | `src/lexer/*Reader.js` | The test suite covers 1 013 unit cases + fuzz. |
| **Plugin** | new file under `src/plugins/<name>/` | Add to `plugins/<name>/index.js` and unit test. |
| **Diagnostics CLI** | `diagnostics.js` | `node diagnostics.js --help`. |

### JS-doc conventions
* Public API exported from `src/index.js` **must stay ESM**.  
* Reader functions **MUST be pure** (no I/O or globals).  
* Use **named exports** for tree-shaking.

## 🧪  How to validate changes
Run lint and tests with coverage. Benchmarks are optional unless `BENCH=1`.
The agent container sets `HUSKY=0` so Git hooks never block.

## 🔧  Useful scripts
| Script | Purpose |
|--------|---------|
| `yarn lint` | ESLint recommended set (warnings allowed). |
| `yarn test` | Jest with incremental VM loader. |
| `yarn bench` | Micro-benchmarks (node `--expose-gc` needed). |
| `yarn build:extension` | VS-Code syntax highlighter bundle. |
| `node src/utils/checkCoverage.js` | Fail if < threshold coverage. |
| `yarn tree` | Generate / update `fileStructure.txt` (directory map). |
| `yarn diag` | Diagnostics CLI. |
| `yarn workflow` | Umbrella: lint → test → coverage → bench. |

Use **Yarn v4** for all project scripts; npm is not used for development.

## 🤖  Codex playbook
> *Read by the agent before each task.*

* **Start** in `src/` root unless prompt specifies path.  
* Obey `.eslintrc.cjs`; auto-fix is allowed.  
* Prefer **small PRs** (< 400 LoC diff). If a task seems large:
  1. Reply with a task breakdown.
  2. Await user confirmation.
* When writing tests:
  * Mirror reader file name e.g. `HexReader.js` → `HexReader.test.js`.
  * Use unicode edge-case fixtures (`tests/fixtures/`).
* After code edits run:

yarn lint --silent
yarn test --silent -- --coverage
node src/utils/diagnostics.js "foo |> bar"

## 🛫  Pre-flight (run in this exact order)

1. `yarn install`
2. `yarn tree` → skim the generated `fileStructure.txt` so you know the lay of the land.
3. `node src/utils/diagnostics.js "let x = 1"` to confirm the lexer still works.
4. `yarn workflow` (fails fast if lint/test/bench regress).

If any step fails **stop** and surface the error; do **not** open a PR.
## 🧰  Script reference

| script | location | what it does |
|--------|----------|--------------|
| `src/utils/diagnostics.js` | Token dump, nesting depth, trivia visualiser, REPL. Run via `yarn diag`. |
| `.github/workflows/scripts/genTree.js` | Writes an ASCII directory map to STDOUT **and** updates / stages `fileStructure.txt`. |
| `src/utils/checkCoverage.js` | Parses **coverage/clover.xml** and throws if total statement coverage < threshold (default 90 %). |
### How the agent should call them

# read-only inspection
yarn tree

# spot-check a lexer rule you’re editing
yarn diag "html`<h1>${name}</h1>`"

## ⚝ Next Steps 
1. ESLint: from “minimal” to “type-smart”
Current (.eslintrc.cjs):

js
Copy
Edit
module.exports = {
  env: { es2021: true, node: true, jest: true },
  extends: ["eslint:recommended"],
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "warn",
    "semi": ["error", "always"],
  },
};
Problems:

No TypeScript-specific linting → misses type-driven anti-patterns

No import ordering or formatting enforcement

Only generic JS rules; can’t leverage type information for deeper checks

Recommended:

js
Copy
Edit
module.exports = {
  parser: "@typescript-eslint/parser",        // use the TS parser
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    project: "./tsconfig.json",              // enables rules requiring type info
  },
  plugins: [
    "@typescript-eslint",                    // TS rules
    "import",                                // import path/order rules
    "prettier",                              // formatting checks
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // TS-specific best practices
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",                              // disables conflicting ESLint rules
  ],
  rules: {
    "no-console": "warn",
    "semi": ["error", "always"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_" }           // allow intentional unused args
    ],
    "@typescript-eslint/strict-boolean-expressions": "error",
    "import/order": [
      "error",
      { alphabetize: { order: "asc", caseInsensitive: true } }
    ],
    "prettier/prettier": "error"
  },
};
Type-aware linting catches mismatches between your code and its intended types (@typescript-eslint/recommended)

Import rules enforce a consistent module layout (plugin:import)

Prettier integration ensures everyone’s formatting is identical

2. tsconfig.json: strict safety + faster builds
Problems:

Likely only basic settings → missing strict-mode family, no incremental builds, no declaration output

Recommended:

jsonc
Copy
Edit
{
  "compilerOptions": {
    "incremental": true,                   // speeds up rebuilds
    "composite": true,                     // required if you reference other projects
    "declaration": true,                   // emit .d.ts for consumers
    "declarationMap": true,                // map back to .ts in IDEs
    "strict": true,                        // enables all strict-mode checks
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "allowJs": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,                  // skip .d.ts checks for speed
    "forceConsistentCasingInFileNames": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
Strict mode (strict: true) enforces no–any, strict null checks, etc.

Incremental + skipLibCheck greatly reduce compile times

Declaration output makes your library consumable in TS projects without extra steps

3. Scripts & CI integration
Add these to your package.json:

jsonc
Copy
Edit
"scripts": {
  "lint": "eslint . --ext .js,.ts",
  "type-check": "tsc --noEmit",
  "build": "tsc -b",
  "test": "jest --coverage"
}
Then in your GitHub Actions (or other CI), run in order:

npm run lint

npm run type-check

npm run test

This ensures every PR meets style, type, and test coverage gates before merging.
