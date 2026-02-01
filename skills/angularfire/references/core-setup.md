---
name: core-setup
description: AngularFire initialization, dependency injection, and Firebase app configuration
---

# AngularFire Core Setup

AngularFire provides Angular-native wrappers around the Firebase JS SDK with dependency injection, Zone.js integration, and RxJS observables.

## Installation

```bash
ng add @angular/fire
```

## App Configuration

Configure Firebase in `app.config.ts` using provider functions:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({
      apiKey: 'your-api-key',
      authDomain: 'your-project.firebaseapp.com',
      projectId: 'your-project-id',
      storageBucket: 'your-project.appspot.com',
      messagingSenderId: 'your-sender-id',
      appId: 'your-app-id'
    })),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    // Add other Firebase services as needed
  ],
};
```

## Provider Functions

Each Firebase product has a corresponding provider function:

| Product | Provider Function | Get Function |
|---------|------------------|--------------|
| Firestore | `provideFirestore` | `getFirestore` |
| Auth | `provideAuth` | `getAuth` |
| Realtime Database | `provideDatabase` | `getDatabase` |
| Storage | `provideStorage` | `getStorage` |
| Functions | `provideFunctions` | `getFunctions` |
| Analytics | `provideAnalytics` | `getAnalytics` |
| Messaging | `provideMessaging` | `getMessaging` |
| Performance | `providePerformance` | `getPerformance` |
| Remote Config | `provideRemoteConfig` | `getRemoteConfig` |
| App Check | `provideAppCheck` | `initializeAppCheck` |
| Vertex AI | `provideVertexAI` | `getVertexAI` |

## Injecting Firebase Services

Use Angular's `inject()` function to access Firebase services:

```typescript
import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  template: `...`
})
export class App {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
}
```

## Import Pattern

AngularFire re-exports the Firebase JS SDK. Replace Firebase imports with AngularFire imports:

```typescript
// Instead of:
import { collection, doc } from 'firebase/firestore';

// Use:
import { collection, doc } from '@angular/fire/firestore';
```

This ensures proper Zone.js wrapping for Angular change detection and SSR compatibility.

## Key Benefits

- **Dependency Injection**: Firebase services are injectable Angular services
- **Zone.js Integration**: Automatic zone wrapping for change detection stability
- **RxJS Observables**: Real-time data streams as Observables
- **Lazy Loading**: Dynamic imports reduce initial bundle size
- **SSR Support**: Compatible with Angular Universal/SSR

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/README.md
- https://github.com/angular/angularfire/blob/main/docs/install-and-setup.md
-->
