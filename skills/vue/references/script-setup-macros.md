---
name: vue-script-setup-macros
description: Vue 3.3+ compiler macros - defineOptions, defineSlots, generic components
---

# Script Setup Macros (3.3+)

## defineOptions()

```vue
<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
  name: 'CustomName'
})
</script>
```

## defineSlots()

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
  header(props: { title: string }): any
}>()
</script>
```

## defineExpose()

```vue
<script setup lang="ts">
const count = ref(0)
const publicMethod = () => {}

defineExpose({ count, publicMethod })
</script>
```

## Named Tuple Emit Syntax (3.3+)

```vue
<script setup lang="ts">
// New syntax (3.3+, preferred)
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()

// Old call signature syntax
const emit = defineEmits<{
  (e: 'change', id: number): void
}>()
</script>
```

## Generic Components

```vue
<script setup lang="ts" generic="T">
defineProps<{ items: T[], selected: T }>()
defineEmits<{ select: [item: T] }>()
</script>
```

### With constraints

```vue
<script setup lang="ts" generic="T extends string | number, U extends Item">
import type { Item } from './types'
defineProps<{ id: T, item: U }>()
</script>
```

## Dual Script Blocks

```vue
<script lang="ts">
// Runs once per module
runSideEffect()
export const exportedValue = 'hello'
</script>

<script setup lang="ts">
// Runs per component instance
</script>
```

<!--
Source references:
- https://vuejs.org/api/sfc-script-setup.html
-->
