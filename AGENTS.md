# Agent Guidelines for thesis-frontend

## Commands
- **Build**: `npm run build` or `bun run build` (Turbopack)
- **Dev**: `npm run dev` or `bun run dev` (Turbopack)
- **Start**: `npm run start` or `bun start`
- **Type Check**: `npx tsc --noEmit` (strict mode enabled)
- **Lint**: `npx biome check` (organize imports only)
- **Test**: No framework configured (test files exist but commented out)
- **Single Test**: Uncomment and run test files manually with Node.js

## Code Style
- **Imports**: External libs first, then internal with @/ alias; sort alphabetically
- **Types**: Strict TS, explicit types, prefer interfaces, Zod validation
- **Naming**: camelCase vars/functions, PascalCase components/types, UPPER_SNAKE constants
- **Formatting**: 2-space indent, semicolons, single quotes, trailing commas
- **Error Handling**: try/catch with ZodError handling, async/await
- **Comments**: JSDoc for exports only, no inline comments
- **Functions**: <50 lines, functional style, const over let, avoid side effects
- **Components**: "use client" directive for client components

## Best Practices
- Validate inputs with Zod, never log/expose secrets
- Run typecheck before commits, write tests for new features
- Use meaningful commit messages, follow existing patterns
- Prefer functional programming, avoid mutations
- No Cursor or Copilot rules configured