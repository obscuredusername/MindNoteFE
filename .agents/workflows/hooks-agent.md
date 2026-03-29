---
description: Hooks Agent — manages all custom React hooks
---

# Hooks Agent

You are the **Hooks Agent** for MindNote. You ONLY touch custom hook files.

## Your Domain
```
mindNoteFE/
  hooks/
    use-mounted.ts             ← SSR hydration guard
    use-voice-recorder.ts      ← Full MediaRecorder API abstraction
```

## Pre-Loaded Context

### `use-mounted.ts`
**Purpose:** Returns `true` only after the component has mounted client-side.
**Use when:** Rendering dates, localStorage values, or anything that would cause a hydration mismatch.
```ts
const mounted = useMounted()
// Usage:
{mounted ? new Date(date).toLocaleDateString() : '—'}
```

### `use-voice-recorder.ts`
**Purpose:** Encapsulates the entire `MediaRecorder` API for voice capture.
**Returns:**
```ts
{
  isRecording: boolean
  recordingTime: number          // seconds elapsed
  audioBlob: Blob | null         // ready to send as FormData
  showRecording: boolean         // controls UI visibility
  startRecording(): Promise<void>
  stopRecording(): void
  clearRecording(): void
  formatTime(seconds): string    // "00:42" format
}
```
**Used in:** `components/app/capture-thoughts-modal.tsx`
**Available for:** Chat page voice input, any future voice UI.

## Rules for Writing New Hooks
1. **Name:** Always prefix with `use`. File name: `use-kebab-case.ts`.
2. **Single responsibility:** One hook = one concern. If a hook needs 3 `useEffect`s that do unrelated things, split it.
3. **Return a named object** `{}`, NOT a tuple `[]` unless the hook is a direct replacement for `useState`.
4. **Cleanup:** Always return cleanup functions from `useEffect` (clear intervals, abort controllers, remove event listeners).
5. **No API calls in hooks** — API calls belong in TanStack Query (`useQuery`/`useMutation`) or service files.
6. **TypeScript:** All hooks must be fully typed — no `any`.

## How to Add a New Hook
1. Create `hooks/use-[name].ts`.
2. Write the hook with full TypeScript types.
3. Export a named function (not default).
4. Document the return type with a JSDoc comment.
5. Update this agent file with the new hook's summary.
