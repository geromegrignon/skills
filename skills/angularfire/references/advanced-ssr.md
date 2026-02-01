---
name: advanced-ssr
description: Server-side rendering with Angular Universal and Firebase
---

# Server-Side Rendering (SSR)

AngularFire supports server-side rendering with Angular Universal, enabling better SEO and faster initial page loads.

## Setup Angular Universal

Add Angular Universal to your project:

```bash
ng add @angular/ssr
```

This creates the server configuration and necessary files for SSR.

## Firebase Integration

AngularFire automatically detects SSR environments and adjusts behavior accordingly.

### Auth in SSR

Use `FirebaseServerApp` for server-side auth context:

```typescript
import { ApplicationConfig, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { REQUEST } from '@angular/ssr';
import { 
  provideFirebaseApp, 
  initializeApp, 
  initializeServerApp, 
  FirebaseApp 
} from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => {
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        return initializeApp(firebaseConfig);
      }
      
      // Server-side initialization
      const request = inject(REQUEST, { optional: true });
      const authIdToken = request?.headers.authorization?.split("Bearer ")[1];
      
      return initializeServerApp(firebaseConfig, {
        authIdToken,
        releaseOnDeref: request || undefined
      });
    }),
    provideAuth(() => getAuth(inject(FirebaseApp))),
  ],
};
```

### Passing Auth Token from Client

Follow Firebase's [Session Management with Service Workers](https://firebase.google.com/docs/auth/web/service-worker-sessions) documentation to pass the `idToken` to the server.

## Deploy SSR to Cloud Functions

### Configuration

Configure SSR deployment in `angular.json`:

```json
{
  "deploy": {
    "builder": "@angular/fire:deploy",
    "options": {
      "ssr": true,
      "functionsNodeVersion": 18,
      "functionsRuntimeOptions": {
        "memory": "1GB",
        "timeoutSeconds": 60
      }
    }
  }
}
```

### Firebase Setup

1. Initialize Firebase with Functions and Hosting:

```bash
firebase init
```

Select `functions` and `hosting`.

2. Configure `firebase.json` rewrites:

```json
{
  "hosting": {
    "public": "dist/my-app/browser",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  },
  "functions": {
    "source": "functions"
  }
}
```

### Manual Cloud Function Setup

For custom SSR function deployment:

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';

export const ssr = functions.https.onRequest((request, response) => {
  require(`${process.cwd()}/dist/my-app/server/main`).app()(request, response);
});
```

Update `firebase.json`:

```json
{
  "hosting": {
    "rewrites": [
      { "source": "**", "function": "ssr" }
    ]
  }
}
```

## Prerendering

Prerender static routes for better performance:

### Configure Routes

Create `prerender-routes.txt` or use Angular's built-in prerender configuration:

```typescript
// angular.json
{
  "prerender": {
    "builder": "@angular-devkit/build-angular:prerender",
    "options": {
      "routes": [
        "/",
        "/about",
        "/contact",
        "/products/featured"
      ]
    }
  }
}
```

### Build with Prerendering

```bash
ng build --configuration=production
```

Prerendered HTML files will be generated in your output directory.

## Platform Detection

Handle browser-only code in SSR:

```typescript
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({...})
export class MyComponent {
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Browser-only code
      window.localStorage.setItem('key', 'value');
    }
    
    if (isPlatformServer(this.platformId)) {
      // Server-only code
    }
  }
}
```

## Conditional Firebase Features

Some Firebase features don't work in SSR:

```typescript
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';

export const appConfig: ApplicationConfig = {
  providers: [
    // Only provide Analytics in browser
    ...(typeof window !== 'undefined' ? [
      provideAnalytics(() => getAnalytics())
    ] : []),
  ],
};
```

## TransferState for Data

Avoid duplicate API calls between server and client:

```typescript
import { Injectable, PLATFORM_ID, inject, makeStateKey, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

const ITEMS_KEY = makeStateKey<any[]>('items');

@Injectable({ providedIn: 'root' })
export class DataService {
  private firestore = inject(Firestore);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);

  async getItems() {
    // Check if data was already fetched on server
    if (this.transferState.hasKey(ITEMS_KEY)) {
      const items = this.transferState.get(ITEMS_KEY, []);
      this.transferState.remove(ITEMS_KEY);
      return items;
    }

    // Fetch data
    const snapshot = await getDocs(collection(this.firestore, 'items'));
    const items = snapshot.docs.map(doc => doc.data());

    // Store for client if on server
    if (isPlatformServer(this.platformId)) {
      this.transferState.set(ITEMS_KEY, items);
    }

    return items;
  }
}
```

## Testing SSR Locally

```bash
# Build and serve SSR locally
npm run dev:ssr

# Or with Firebase emulator
ng deploy --preview
firebase serve
```

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/universal/getting-started.md
- https://github.com/angular/angularfire/blob/main/docs/universal/cloud-functions.md
- https://github.com/angular/angularfire/blob/main/docs/universal/prerendering.md
-->
