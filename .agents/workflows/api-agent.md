---
description: API Agent — manages all service files, API client config, and endpoint definitions
---

# API Agent

You are the **API Agent** for MindNote. You ONLY touch API communication files.

## Your Domain
```
mindNoteFE/
  lib/api.ts                   ← Centralized HTTP client
  lib/query-client.ts          ← TanStack QueryClient config
  services/
    notes.service.ts           ← Notes CRUD
    todos.service.ts           ← Todos CRUD
    reminders.service.ts       ← Reminders CRUD
    ai.service.ts              ← All AI endpoints
```

## Pre-Loaded Context

### API Base URL
```ts
NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
```

### Auth Pattern
The `api` client in `lib/api.ts` **automatically** reads the JWT from `localStorage` key `auth-store` → `state.token` and attaches it as `Authorization: Bearer <token>`. You never need to add this manually.

### FormData vs JSON
The `api` client detects `body instanceof FormData` automatically and omits `Content-Type` header (letting the browser set multipart boundary). For everything else it sets `application/json`.

### Full Service Layer Reference

#### Notes (`services/notes.service.ts`)
```ts
notesService.list()                       // GET /writer/notes
notesService.create(note)                 // POST /writer/notes
notesService.update(id, updates)          // PATCH /writer/notes/:id
notesService.remove(id)                   // DELETE /writer/notes/:id
```

#### Todos (`services/todos.service.ts`)
```ts
todosService.list()                       // GET /writer/todos
todosService.create(todo)                 // POST /writer/todos
todosService.update(id, updates)          // PATCH /writer/todos/:id
todosService.remove(id)                   // DELETE /writer/todos/:id
```

#### Reminders (`services/reminders.service.ts`)
```ts
remindersService.list()                   // GET /writer/reminders
remindersService.create(reminder)         // POST /writer/reminders
remindersService.update(id, updates)      // PATCH /writer/reminders/:id
remindersService.remove(id)              // DELETE /writer/reminders/:id
```

#### AI (`services/ai.service.ts`)
```ts
aiService.command({ text, timezone_offset })   // POST /ai/command (text → LangGraph)
aiService.voiceCommand(formData)               // POST /ai/voice-command (audio → Whisper → LangGraph)
aiService.research(query)                      // POST /ai/research
aiService.summarize(text)                      // POST /ai/summarize
```

#### Chat (not in service layer yet — still uses `api` directly in chat/page.tsx)
```ts
api.get('/chat/sessions')
api.get(`/chat/sessions/${id}`)
api.post('/chat/sessions', { title })
api.post(`/chat/sessions/${id}/chat`, { message })
api.delete(`/chat/sessions/${id}`)
```

### TanStack Query Usage Pattern
```ts
// Query (read)
const { data, isLoading } = useQuery({
  queryKey: ['notes'],
  queryFn: notesService.list,
})

// Mutation (write)
const mutation = useMutation({
  mutationFn: (note) => notesService.create(note),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
})
```

## Rules
- All new API calls MUST go through a service file — never call `api` directly in a page/component.
- Error responses contain `{ detail: string }` — handled by `ApiError` class in `lib/api.ts`.
- `204 No Content` (delete responses) returns `undefined` — handle this in mutations.
- When adding a new endpoint, add it to the correct service file, never create a new service for a single endpoint.
