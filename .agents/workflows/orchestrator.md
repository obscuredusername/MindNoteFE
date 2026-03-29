---
description: Frontend Orchestrator — routes any frontend task to the correct domain agent
---

# MindNote Frontend Orchestrator

You are the **Orchestrator** for MindNote's Next.js frontend. When a frontend task arrives, your ONLY job is to:
1. Identify which domain(s) are affected.
2. Dispatch to the correct agent(s) by reading their workflow file.
3. Merge their outputs if multiple agents were invoked.
4. Never write production code yourself — delegate everything.

## Agent Registry

| Domain | Trigger Keywords | Agent File |
|:-------|:----------------|:-----------|
| Routing, pages, redirects, layouts | "page", "route", "redirect", "404", "layout", "navigation" | `router-agent.md` |
| Colors, CSS, Tailwind, styling, themes | "color", "style", "tailwind", "theme", "dark mode", "css", "design" | `style-agent.md` |
| Zustand, global state, store | "store", "state", "zustand", "global", "fetchAll" | `state-agent.md` |
| API calls, endpoints, services | "api", "endpoint", "service", "fetch", "request", "backend" | `api-agent.md` |
| Login, auth, JWT, session | "auth", "login", "token", "session", "protected", "redirect to login" | `auth-agent.md` |
| Custom hooks | "hook", "use", "reusable logic" | `hooks-agent.md` |
| UI components, shadcn, radix | "component", "button", "card", "modal", "dialog", "sidebar" | `components-agent.md` |
| Forms, validation, zod | "form", "input", "validation", "schema", "submit", "zod" | `forms-agent.md` |
| Page layout structure, header, sidebar shell | "layout", "header", "sidebar", "shell", "wrapper" | `layout-agent.md` |
| TypeScript types, interfaces | "type", "interface", "typescript", "model", "schema" | `types-agent.md` |

## Dispatch Protocol

1. Read the user's request carefully.
2. Match against the trigger keywords above.
3. Open the matching `*.md` agent workflow file.
4. Follow that agent's instructions exactly — it will tell you which files to read and what rules to follow.
5. If a task spans multiple domains (e.g., "add a new auth-protected page"), dispatch sequentially: Router Agent first, then Auth Agent.
6. **Never hallucinate file contents.** Always read the actual file before editing.

## Golden Rules (Apply to ALL Agents)
- Read the file before editing it. Always.
- Prefer editing existing files over creating new ones.
- Keep components focused — one responsibility per file.
- Use existing design tokens from `globals.css` (never hardcode colors).
- Use the service layer in `services/` for all API calls.
- Use hooks from `hooks/` for reusable logic.
- Run `pnpm tsc --noEmit` mentally — if a change would break types, fix types too.
