---
name: vue-advanced-patterns
description: Vue async setup pitfalls and InjectionKey typing patterns
---

# Advanced Vue Patterns

## Async Setup Pitfalls

Components with top-level `await` require `<Suspense>` boundary. In Nuxt, this is handled automatically.

### Watchers in async callbacks aren't auto-disposed

```ts
// ❌ Memory leak
setTimeout(() => {
  watch(source, callback) // must stop manually
}, 1000)

// ✅ Watchers in sync setup are auto-disposed
watch(source, callback)
```

## InjectionKey for Type-Safe Provide/Inject

```ts
// keys.ts
import type { InjectionKey, Ref } from 'vue'

export const countKey = Symbol() as InjectionKey<Ref<number>>
```

```vue
<!-- Provider -->
<script setup lang="ts">
import { provide, ref } from 'vue'
import { countKey } from './keys'
provide(countKey, ref(0))
</script>
```

```vue
<!-- Injector -->
<script setup lang="ts">
import { inject } from 'vue'
import { countKey } from './keys'
const count = inject(countKey) // Ref<number> | undefined
</script>
```

### Readonly pattern

```vue
<script setup lang="ts">
import { provide, ref, readonly } from 'vue'

const location = ref('North Pole')
provide('location', {
  location: readonly(location),
  updateLocation: (v: string) => { location.value = v }
})
</script>
```

## Global Custom Properties

```ts
// types/vue.d.ts
declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

<!--
Source references:
- https://vuejs.org/guide/built-ins/suspense.html
- https://vuejs.org/guide/components/provide-inject.html
-->
