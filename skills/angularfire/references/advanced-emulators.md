---
name: advanced-emulators
description: Local development with Firebase Emulator Suite
---

# Firebase Emulator Suite

The Firebase Emulator Suite allows you to test your app locally without affecting production data.

## Setup Emulators

Initialize Firebase emulators:

```bash
firebase init emulators
```

This configures `firebase.json` with emulator ports:

```json
{
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "database": { "port": 9000 },
    "functions": { "port": 5001 },
    "storage": { "port": 9199 },
    "pubsub": { "port": 8085 },
    "ui": { "enabled": true, "port": 4000 }
  }
}
```

## Start Emulators

```bash
firebase emulators:start
```

Access the Emulator UI at `http://localhost:4000`.

## Connecting AngularFire to Emulators

### Modern API (Recommended)

Connect each service to its emulator in the provider functions:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideDatabase, getDatabase, connectDatabaseEmulator } from '@angular/fire/database';
import { provideFunctions, getFunctions, connectFunctionsEmulator } from '@angular/fire/functions';
import { provideStorage, getStorage, connectStorageEmulator } from '@angular/fire/storage';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      return auth;
    }),
    
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    
    provideDatabase(() => {
      const database = getDatabase();
      if (environment.useEmulators) {
        connectDatabaseEmulator(database, 'localhost', 9000);
      }
      return database;
    }),
    
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
    
    provideStorage(() => {
      const storage = getStorage();
      if (environment.useEmulators) {
        connectStorageEmulator(storage, 'localhost', 9199);
      }
      return storage;
    }),
  ],
};
```

### Environment Configuration

Configure environments to toggle emulators:

```typescript
// environments/environment.ts (development)
export const environment = {
  production: false,
  useEmulators: true,
  firebase: {
    apiKey: '...',
    authDomain: '...',
    projectId: '...',
    // ...
  }
};

// environments/environment.prod.ts (production)
export const environment = {
  production: true,
  useEmulators: false,
  firebase: {
    apiKey: '...',
    authDomain: '...',
    projectId: '...',
    // ...
  }
};
```

## Emulator-Specific Features

### Auth Emulator

The Auth emulator allows:
- Creating test users without email verification
- Testing different auth providers
- Clearing users between test runs

```typescript
// In Auth emulator, you can sign in without real credentials
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';

// These work without actual email verification in emulator
await createUserWithEmailAndPassword(auth, 'test@test.com', 'password123');
await signInWithEmailAndPassword(auth, 'test@test.com', 'password123');
```

### Firestore Emulator

Clear data between tests:

```bash
# Via REST API
curl -X DELETE http://localhost:8080/emulator/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents
```

### Import/Export Data

Export emulator data for consistent test state:

```bash
# Export
firebase emulators:export ./emulator-data

# Start with imported data
firebase emulators:start --import=./emulator-data
```

## Testing with Emulators

### E2E Test Setup

```typescript
// test-setup.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const app = initializeApp({ projectId: 'demo-test-project' });
const firestore = getFirestore(app);
const auth = getAuth(app);

connectFirestoreEmulator(firestore, 'localhost', 8080);
connectAuthEmulator(auth, 'http://localhost:9099');
```

### Security Rules Testing

Test Firestore security rules:

```typescript
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

const testEnv = await initializeTestEnvironment({
  projectId: 'demo-test',
  firestore: {
    host: 'localhost',
    port: 8080,
    rules: fs.readFileSync('firestore.rules', 'utf8')
  }
});

// Test authenticated access
const authenticatedContext = testEnv.authenticatedContext('user123');
await assertSucceeds(
  authenticatedContext.firestore().collection('users').doc('user123').get()
);

// Test unauthenticated access
const unauthenticatedContext = testEnv.unauthenticatedContext();
await assertFails(
  unauthenticatedContext.firestore().collection('private').doc('secret').get()
);
```

## CI/CD with Emulators

Run emulators in CI:

```yaml
# GitHub Actions
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - name: Install Firebase CLI
        run: npm install -g firebase-tools
      - name: Run tests with emulators
        run: firebase emulators:exec "npm test"
```

## Common Issues

### Port Conflicts

If ports are in use, specify different ports in `firebase.json` or use:

```bash
firebase emulators:start --only firestore,auth
```

### Cold Start Delays

Functions emulator has cold starts. For faster iteration:

```bash
firebase emulators:start --only functions --inspect-functions
```

### Data Persistence

By default, emulator data is cleared on restart. Use export/import for persistence:

```bash
firebase emulators:start --export-on-exit=./emulator-data --import=./emulator-data
```

<!--
Source references:
- https://firebase.google.com/docs/emulator-suite
- https://firebase.google.com/docs/emulator-suite/connect_auth
- https://firebase.google.com/docs/emulator-suite/connect_firestore
-->
