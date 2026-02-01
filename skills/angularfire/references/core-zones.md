---
name: core-zones
description: Zone.js wrappers for Firebase API stability in Angular applications
---

# Zone Wrappers

AngularFire wraps Firebase JS SDK and RxFire to ensure proper functionality in both Zone.js and Zoneless Angular applications.

## Why Zone Wrapping Matters

Zone wrappers ensure Firebase APIs are called outside the Angular zone, isolating side-effects like timers that could destabilize your application.

**Without proper zone wrapping, you may experience:**
- Change detection issues
- Two-way binding problems
- Rehydration bugs in SSR
- SSR/SSG timeouts or blank pages

## When Zone Wrapping is Critical

Zone wrapping is essential for:
- Real-time listeners (Firestore `onSnapshot`, RTDB listeners)
- Observable-based APIs
- Promise-based APIs that trigger side effects
- Callbacks with long-lived timers

## Safe Operations (Zone Wrapping Less Critical)

These operations are generally safe without zone wrapping:
- Adding/deleting/updating documents in response to user input
- Signing users in/out
- Calling Cloud Functions
- One-time reads (no listeners)

## Logging Configuration

AngularFire emits warnings in dev-mode when APIs are called outside injection context. Configure logging levels:

```typescript
import { setLogLevel, LogLevel } from "@angular/fire";

// Options: SILENT, WARN (default with ZoneJS), VERBOSE
setLogLevel(LogLevel.VERBOSE);
```

| Log Level | Behavior |
|-----------|----------|
| `SILENT` | Only shows banner when APIs called outside injection context (default for Zoneless) |
| `WARN` | Logs blocking reads, long-lived tasks, high-risk APIs (default with ZoneJS) |
| `VERBOSE` | Logs all AngularFire APIs called outside injection context |

## Best Practices

1. **Always use AngularFire imports** instead of direct Firebase imports:

```typescript
// Correct - zone-wrapped
import { collection, collectionData } from '@angular/fire/firestore';

// Avoid - not zone-wrapped
import { collection } from 'firebase/firestore';
```

2. **Inject services within injection context**:

```typescript
@Component({...})
export class App {
  // Correct - within injection context
  private firestore = inject(Firestore);
  
  constructor() {
    // This is also within injection context
  }
}
```

3. **Avoid calling Firebase APIs in callbacks outside injection context**:

```typescript
// May cause issues - outside injection context
setTimeout(() => {
  const data = await getDocs(collection(firestore, 'items'));
}, 1000);
```

## SSR Considerations

For server-side rendering:
- Observables and Promise-based APIs destabilize the app until initial value returns
- This ensures SSR/SSG waits for data before rendering HTML
- Use `isPlatformBrowser()` to conditionally run browser-only code

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/zones.md
-->
