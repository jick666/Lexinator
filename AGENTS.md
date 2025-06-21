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
| **Core lexing rule** | `src/lexer/*Reader.js` | `npm test` runs 1 858 unit cases + fuzz. |
| **Plugin** | new file under `src/plugins/<name>/` | Add to `plugins/<name>/index.js` and unit test. |
| **Diagnostics CLI** | `diagnostics.js` | `node diagnostics.js --help`. |

### JS-doc conventions
* Public API exported from `src/index.js` **must stay ESM**.  
* Reader functions **MUST be pure** (no I/O or globals).  
* Use **named exports** for tree-shaking.

## 🧪  How to validate changes
Codex should run **`npm run workflow`** (umbrella) which does:

1. `eslint .`
2. `npm test --coverage`
3. `node tests/benchmarks/lexer.bench.js` (bench output ignored unless `BENCH=1`)

The agent container sets `HUSKY=0` so Git hooks never block.

## 🔧  Useful scripts
| Script | Purpose |
|--------|---------|
| `npm run lint` | ESLint recommended set (warnings allowed). |
| `npm test` | Jest with incremental VM loader. |
| `npm run bench` | Micro-benchmarks (node `--expose-gc` needed). |
| `npm run build:extension` | VS-Code syntax highlighter bundle. |
| `npm run check:coverage` | Fail if < 90 % coverage. |

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

npm run lint --silent
npm test --silent -- --coverage
node diagnostics.js "foo |> bar"
