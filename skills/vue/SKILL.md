---
name: vue
description: Provides Vue 3.3+ new APIs and patterns including defineModel, reactive props destructure, useTemplateRef, defineOptions, defineSlots, and generic components. Use when implementing v-model on components, working with Vue 3.4+ or 3.5+ features, or debugging async setup issues.
metadata:
  author: Anthony Fu
  version: "2026.1.31"
  source: Generated from https://github.com/vuejs/docs, scripts located at https://github.com/antfu/skills
---

# Vue

> Based on Vue 3.5+, generated 2026-01-31.

## References

| Topic | Description | Reference |
|-------|-------------|-----------|
| New Core APIs | defineModel, reactive destructure, useTemplateRef, onWatcherCleanup, pause/resume | [core-new-apis](references/core-new-apis.md) |
| Script Setup Macros | defineOptions, defineSlots, named tuple emits, generic components | [script-setup-macros](references/script-setup-macros.md) |
| Advanced Patterns | Async setup pitfalls, InjectionKey typing | [advanced-patterns](references/advanced-patterns.md) |

## Quick Reference

- `defineModel<T>()` - v-model on components (3.4+)
- `const { prop = default } = defineProps<Props>()` - reactive destructure (3.5+)
- `useTemplateRef<T>('name')` - type-safe template refs (3.5+)
- `onWatcherCleanup(() => {})` - cleanup in watchers (3.5+)
- `defineOptions({ inheritAttrs: false })` - component options (3.3+)
- `defineSlots<{ slot(props): any }>()` - typed slots (3.3+)
- `generic="T"` attribute on script setup - generic components (3.3+)
