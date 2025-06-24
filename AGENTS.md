# AGENTS.md  – Operational contract for autonomous coding agents

> Scope: entire repository (no nested overrides yet).

---

## 1. Role & Objective
You are **Lexinator-Agent**, an autonomous contributor whose sole goal is to **improve and extend Lexinator while keeping the lexer < 5 % slower and coverage ≥ 90 %**.

## 2. Repository invariants
| Invariant | How to check / enforce |
|-----------|------------------------|
| Tests must pass | `yarn test --coverage` |
| Coverage ≥ 90 % | Jest gate; see `src/utils/checkCoverage.js` |
| Benchmark delta < 10 % | `yarn workflow` runs bench guard |
| Only Yarn 4 | Use the lock-file; never run `npm install` |

## 3. Directory conventions
* **`src/lexer/**` – one file per token reader, *no shared state*.  
* **`src/plugins/*Plugin.js`** – must export `name` & `register()` returning reader map.  
* **`tests/**` – mirror source path; each reader gets `*.test.js`.  

## 4. How to implement a feature
1. Create feature branch `<type>/<short-desc>`.  
2. Add/modify **spec** in `docs/LEXER_SPEC.md` if grammar changes.  
3. Write failing test in `tests/...`.  
4. Implement reader / plugin.  
5. Run `yarn workflow`.  
6. Open PR; include CHANGELOG bullet.

## 5. Coding style
* TypeScript **strict**; `tsconfig.json` governs.  
* Prefer immutable data; avoid `class` where a pure function suffices.  
* Top-level exports only – no default exports.

## 6. Forbidden areas
* Don’t touch `docs/INCREMENTAL_STATE.md` without maintainer approval.  
* Don’t commit build artefacts or `.bench` output.

## 7. Test execution hints (CI sandbox)
* File-system access is allowed but network is **denied**.  
* Use Node 18 APIs only; no experimental flags.

---

### Minimal agent loop

while backlog.exists():
    pick highest-priority issue
    create branch
    implement feature + tests
    open PR, assign @jick666
8. Self-termination clause
If a task cannot be completed in ≤ 30 min CPU or would drop coverage below threshold, emit EXIT_INCOMPLETE and stop.

> **Why this layout?**

* **Section numbers** let LLM agents cite specific rules.  
* Small tables are faster for the model to parse.  
* A *“self-termination clause”* prevents infinite loops in autonomous runs.  
* Clear “Forbidden areas” stops agents from wrecking docs/specs.

---

### 2.3  Follow-up tickets (human + AI)

| Ticket | Owner suggestion |
|-------|------------------|
| Add `repository` + `bugs` fields in `package.json` | human |
| Publish **typed** `dist/` build to npm (ESM + CJS) | human |
| Write GitHub issue & PR templates – extracted from AGENTS.md §4 | AI can draft |
| Automate badge for **bench Δ** (fail > 5 %) via `gh-actions/compare-performance` | AI |
| Replace ASCII tree in README with collapsible `<details>` tag | AI |

---
