# AGENTS.md – Lexinator Contributor & Codex Guide
Last updated: 2025-06-21

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
| **Core lexing rule** | `src/lexer/*Reader.js` | The test suite covers 1 858 unit cases + fuzz. |
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

*NPM scripts have been removed; use Yarn commands only.*

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
| `src/utils/diagnostics.js` | Token dump, nesting depth, trivia visualiser, REPL. Exposed via the `lexdiag` bin. |
| `.github/workflows/scripts/genTree.js` | Writes an ASCII directory map to STDOUT **and** updates / stages `fileStructure.txt`. |
| `src/utils/checkCoverage.js` | Parses **coverage/clover.xml** and throws if total statement coverage < threshold (default 90 %). |
### How the agent should call them

# read-only inspection
yarn tree

# spot-check a lexer rule you’re editing
yarn diag "html`<h1>${name}</h1>`"

# Next Steps for Unit Tests:
Ensure the following with Unit Tests:

1. Property-based tests with a library like fast-check to replace fuzz.test.js. Today the fuzz only asserts no exception; add expectations such as “tokenising then joining value fields reproduces the original text” or “re-serialising via save/restore yields same tokens”.

2. Cover “stateInput: 'none'” restore path—including error throw when caller forgets to supply input.

3. Golden/snapshot tests for full-file fixtures (multi-language examples, JSX + template + regex combos). This guards against subtler regression than token-count equality.
