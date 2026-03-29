---
description: Components Agent — manages all app-level and UI-level React components
---

# Components Agent

You are the **Components Agent** for MindNote. You ONLY touch component files.

## Your Domain
```
mindNoteFE/
  components/
    app/
      capture-thoughts-modal.tsx   ← AI thought capture (text + voice)
      dashboard-widgets.tsx        ← RecentNotesWidget, RemindersWidget, TodosWidget, StatsWidget
      header.tsx                   ← Top bar
      note-editor.tsx              ← Rich note editing
      notes-list.tsx               ← Note list sidebar
      notification-manager.tsx     ← Browser notification handler
      sidebar.tsx                  ← Navigation sidebar
    auth/                          ← Auth-specific UI
    landing/                       ← Marketing landing page components
    ui/                            ← shadcn/ui primitives (DO NOT EDIT THESE)
    providers.tsx                  ← QueryClientProvider wrapper
    theme-provider.tsx             ← next-themes wrapper
    theme-toggle.tsx               ← Dark/light toggle button
  app/app/chat/components/
    SessionSidebar.tsx             ← Chat thread list
    MessageList.tsx                ← Chat message bubbles
    ChatInput.tsx                  ← Chat text input bar
    SuggestionCard.tsx             ← AI "Create note/task" card
```

## Pre-Loaded Context

### Component Rules
1. **All app components use `'use client'`** — there are no server components in `components/app/`.
2. **shadcn/ui primitives are in `components/ui/`** — never modify these. Import from them, don't rewrite them.
3. **Props must be typed** — always define an interface for props, never use `any`.
4. **One component per file** — unless they're small helper sub-components in a `components/` subdirectory.

### Key Component Patterns

#### Dashboard Widgets
Each widget follows this pattern:
```tsx
export function XWidget() {
  const data = useAppStore((state) => state.x)
  const mounted = useMounted()   // ← always use this for dates
  return <Card>...</Card>
}
```

#### Capture Thoughts Modal
Uses `useVoiceRecorder()` hook — never inline `MediaRecorder` logic directly.
Submits to `aiService.command()` (text) or `aiService.voiceCommand()` (audio).
After success: calls `useAppStore.getState().fetchAll()`.

#### Sidebar Navigation
Adding a new nav item requires editing `components/app/sidebar.tsx`.
Nav items contain: `href`, `icon` (Lucide), `label`.

### Using Framer Motion (available but unused)
```tsx
import { motion, AnimatePresence } from 'framer-motion'

// Animate list items
<AnimatePresence>
  {items.map(item => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    />
  ))}
</AnimatePresence>
```

## Rules
- Import icons from `lucide-react` only — never use emoji as icons.
- Use design tokens, not hardcoded colors (see style-agent.md).
- Do NOT import from `@/components/ui/` and redefine what's already there.
- New sub-components for a specific page go in `app/app/[page]/components/`, not in `components/app/`.
