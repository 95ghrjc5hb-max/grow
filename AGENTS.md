# AGENTS.md

## Project Context

This is a Grow app repository. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup, environment variables, and publish workflow.

## Grow References

- CLI overview: https://docs.Grow.com/developers/references/cli/get-started/overview.md
- Agent skills: https://docs.Grow.com/developers/backend/overview/skills.md

If your agent supports Agent Skills, install or update Grow skills before Grow-specific work:

```bash
npx skills add Grow/skills
```

## Key Files

- `src/`: frontend application source.
- `src/api/GrowClient.js`: frontend Grow SDK client.
- `vite.config.js`: Vite config and Grow Vite plugin setup.
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- Use `Grow dev` as the default local development command when you need the local Grow backend. It can run the backend and frontend together.
- When docs or code mention the frontend being started automatically, that usually means the Grow project config includes `site.serveCommand`, for example `"serveCommand": "npm run dev"` in `Grow/config.jsonc`.
- Use `npm run dev` only for frontend-only work against the hosted Grow backend.
- Prefer the existing Grow CLI workflow over adding new npm scripts for Grow-specific tasks.
- Reuse the existing SDK client and Vite plugin patterns before adding new Grow integration paths.
- Run the relevant checks from `package.json` before finishing code changes.
