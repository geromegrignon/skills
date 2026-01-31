---
name: vue-new-apis
description: Vue 3.4+ and 3.5+ APIs - defineModel, reactive destructure, useTemplateRef, onWatcherCleanup
---

# New Vue APIs (3.4+, 3.5+)

## defineModel() (3.4+)

```vue
<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <input v-model="model" />
</template>
```

### Named v-model

```vue
<script setup lang="ts">
const firstName = defineModel<string>('firstName')
const lastName = defineModel<string>('lastName')
</script>
```

```vue-html
<UserName v-model:first-name="first" v-model:last-name="last" />
```

### Modifiers

```vue
<script setup lang="ts">
const [model, modifiers] = defineModel<string>({
  set(value) {
    return modifiers.capitalize
      ? value.charAt(0).toUpperCase() + value.slice(1)
      : value
  }
})
</script>
```

### Typing

```ts
const model = defineModel<string>()                           // Ref<string | undefined>
const model = defineModel<string>({ required: true })         // Ref<string>
const [model, mods] = defineModel<string, 'trim' | 'cap'>()   // mods: Record<..., true | undefined>
```

## Reactive Props Destructure (3.5+)

```vue
<script setup lang="ts">
const { msg = 'hello', count = 0 } = defineProps<{
  msg?: string
  count?: number
}>()

watchEffect(() => console.log(msg, count)) // reactive
```

### Passing to watchers/composables

```ts
const { foo } = defineProps(['foo'])

watch(() => foo, callback)      // ✅ wrap in getter
useComposable(() => foo)        // ✅ wrap in getter
watch(foo, callback)            // ❌ passes value, not reactive
```

## onWatcherCleanup (3.5+)

```ts
import { watch, onWatcherCleanup } from 'vue'

watch(id, async (newId) => {
  const controller = new AbortController()
  fetch(`/api/${newId}`, { signal: controller.signal })
  onWatcherCleanup(() => controller.abort())
})
```

## Pause/Resume Watchers (3.5+)

```ts
const { stop, pause, resume } = watchEffect(() => { /* ... */ })
```

## useTemplateRef (3.5+)

```vue
<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'

const inputRef = useTemplateRef<HTMLInputElement>('input')
onMounted(() => inputRef.value?.focus())
</script>

<template>
  <input ref="input" />
</template>
```

### Component refs

```ts
type ChildInstance = InstanceType<typeof Child>
const childRef = useTemplateRef<ChildInstance>('child')
```

## watch once (3.4+)

```ts
watch(source, callback, { once: true })
```

<!--
Source references:
- https://vuejs.org/api/sfc-script-setup.html#definemodel
- https://vuejs.org/guide/components/v-model.html
- https://vuejs.org/guide/essentials/watchers.html
-->
