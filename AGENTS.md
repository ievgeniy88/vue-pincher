# AGENTS.md

## Cursor Cloud specific instructions

**vue-pincher** is a Vue 3 image cropper component library with a bundled demo app. It is a single npm package (not a monorepo).

### Project layout

- `lib/` — Library source code (published to npm): component, manipulator, crop logic, input handler, and their tests.
- `src/` — Demo/dev application used for local development and manual testing.
- `dist/` — Build output (git-ignored).

### Key commands

All commands are defined in `package.json` scripts:

| Task | Command |
|---|---|
| Install deps | `npm install` |
| Dev server | `npm start` (Vite on port 5173) |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Test | `npm test` (Vitest + coverage) |
| Build | `npm run build` (Vite lib build + vue-tsc declarations) |

### Notes

- The pre-commit hook (`.husky/pre-commit`) runs `npm run lint`, `npm run typecheck`, and `npm run test` before every commit. All must pass.
- Tests use `happy-dom` as the DOM environment — no browser required for automated tests.
- No databases, Docker, or external services are needed. The project is entirely client-side.
- Node 22.x is the primary CI version; Node 20.x is also tested.
