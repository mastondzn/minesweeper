# Agent Notes

## Quick Commands

| Task                    | Command           |
| ----------------------- | ----------------- |
| Dev server              | `pnpm dev`        |
| Build (incl. typecheck) | `pnpm build`      |
| Run tests               | `pnpm test --run` |
| Lint                    | `pnpm lint`       |
| Typecheck only          | `pnpm typecheck`  |
| Format                  | `pnpm format`     |

- **Package manager:** pnpm (locked to `10.33.0` via `packageManager`).
- **Node version:** Use a current LTS.

## Architecture

- Single Vite + React app. Entry: `index.html` → `src/main.tsx` → `src/app.tsx`.
- State management uses **@xstate/store** with `immer` (`createStoreWithProducer`), not zustand (readme is stale).
- Game logic lives in `src/utils/game.ts`; grid primitives in `src/utils/grid.ts`.
- Local storage layer at `src/utils/storage.ts` uses `superjson` + `zod` schemas.

## Important Conventions

- **Path alias:** `~/*` resolves to `./src/*` (configured in `tsconfig.json` and Vite).
- **TypeScript strictness:** `noUncheckedIndexedAccess`, `noUnusedLocals`, and `noUnusedParameters` are enabled. Unused vars and implicit `undefined` accesses will fail builds.
- **Tailwind:** v4 via `@tailwindcss/vite`. ESLint tailwind plugin entry point is `./src/index.css`.
- **Prettier:** `tabWidth: 4`, `printWidth: 100`, `singleQuote: true`.

## Testing

- **Runner:** Vitest with `happy-dom` environment.
- Only `tests/` are included; `src` is also type-checked alongside tests.
- Run a single test file: `pnpm test tests/storage.test.ts --run`.

## Linting

- The project uses `@mastondzn/eslint` with TypeScript project service and Tailwind CSS integration.
- **Many rules are autofixable** — run `pnpm lint` first and check if errors clear with `pnpm eslint $FILE --fix` before manually editing.
- Warnings should not be addressed.

## Build & Deploy

- Output goes to `dist/` (ignored by git).
- `pnpm preview` serves the production build locally.
