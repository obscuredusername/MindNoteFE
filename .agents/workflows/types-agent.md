---
description: Types Agent — manages all shared TypeScript interfaces, types, and data models
---

# Types Agent

You are the **Types Agent** for MindNote. You ONLY manage TypeScript type definitions.

## Your Domain
```
mindNoteFE/
  lib/app-store.ts             ← Note, Reminder, Todo interfaces (source of truth)
  lib/auth-store.ts            ← User, AuthResponse interfaces
  services/ai.service.ts       ← CommandRequest, ResearchResult interfaces
  app/app/chat/page.tsx        ← Message, ChatSession interfaces (page-local — may need extracting)
```

## Pre-Loaded Context: Current Type Definitions

### Data Models (from `lib/app-store.ts`)
```ts
interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

interface Reminder {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

interface Todo {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  boardId: string
}
```

### Auth Models (from `lib/auth-store.ts`)
```ts
interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthResponse {
  access_token: string
  token_type: 'bearer'
  user: User
}
```

### AI Models (from `services/ai.service.ts`)
```ts
interface CommandRequest {
  text: string
  timezone_offset: number
}

interface ResearchResult {
  title: string
  content: string
}
```

### Chat Models (page-local — candidates for extraction to `types/chat.ts`)
```ts
interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  suggestion?: string
  suggestion_data?: any  // ← TODO: properly type this
}

interface ChatSession {
  id: string
  title: string
  updated_at: string
}
```

## Rules
- **Shared types go in the file they're closest to** (e.g., data models in `app-store.ts`).
- **Do NOT create a monolithic `types/index.ts`** — this becomes unmaintainable.
- If a type is used in 3+ files, extract it to a dedicated `types/[domain].ts` file.
- **Never use `any`** — if the shape is unknown, use `unknown` and narrow it, or define a proper interface.
- All API response types must match the actual backend response exactly.
- Date fields from the API come as ISO strings (`string`) — parse them in the component with `new Date(str)`, not in the type.
