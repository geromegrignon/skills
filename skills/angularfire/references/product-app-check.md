---
name: product-app-check
description: Firebase App Check for protecting backend resources from abuse
---

# App Check

Firebase App Check helps protect your API resources from abuse by preventing unauthorized clients from accessing your backend.

## Setup

```typescript
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAppCheck, initializeAppCheck, ReCaptchaV3Provider } from '@angular/fire/app-check';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    provideAppCheck(() => initializeAppCheck(getApp(), {
      provider: new ReCaptchaV3Provider('your-recaptcha-site-key'),
      isTokenAutoRefreshEnabled: true
    })),
  ],
};
```

## Injecting App Check

```typescript
import { Component, inject } from '@angular/core';
import { AppCheck } from '@angular/fire/app-check';

@Component({...})
export class AppCheck {
  private appCheck = inject(AppCheck);
}
```

## ReCaptcha Enterprise Provider

For production apps, use ReCaptcha Enterprise:

```typescript
import { 
  provideAppCheck, 
  initializeAppCheck, 
  ReCaptchaEnterpriseProvider 
} from '@angular/fire/app-check';

provideAppCheck(() => initializeAppCheck(getApp(), {
  provider: new ReCaptchaEnterpriseProvider('your-recaptcha-enterprise-site-key'),
  isTokenAutoRefreshEnabled: true
})),
```

## Debug Token for Development

Use debug tokens during development:

```typescript
import { 
  provideAppCheck, 
  initializeAppCheck, 
  ReCaptchaV3Provider 
} from '@angular/fire/app-check';
import { environment } from '../environments/environment';

provideAppCheck(() => {
  if (!environment.production) {
    // Enable debug token in development
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  
  return initializeAppCheck(getApp(), {
    provider: new ReCaptchaV3Provider('your-recaptcha-site-key'),
    isTokenAutoRefreshEnabled: true
  });
}),
```

## Getting App Check Token

Manually retrieve tokens for custom API calls:

```typescript
import { AppCheck, getToken } from '@angular/fire/app-check';

@Component({...})
export class App {
  private appCheck = inject(AppCheck);

  async callProtectedApi(endpoint: string) {
    try {
      // Get App Check token
      const appCheckToken = await getToken(this.appCheck, false);
      
      // Include token in API request
      const response = await fetch(endpoint, {
        headers: {
          'X-Firebase-AppCheck': appCheckToken.token,
        },
      });
      
      return response.json();
    } catch (error) {
      console.error('App Check token error:', error);
      throw error;
    }
  }
}
```

## HTTP Interceptor for App Check

Automatically add App Check tokens to HTTP requests:

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { AppCheck, getToken } from '@angular/fire/app-check';

@Injectable()
export class AppCheckInterceptor implements HttpInterceptor {
  private appCheck = inject(AppCheck);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add token to your API endpoints
    if (!req.url.includes('your-api-domain.com')) {
      return next.handle(req);
    }

    return from(getToken(this.appCheck, false)).pipe(
      switchMap(tokenResult => {
        const clonedReq = req.clone({
          setHeaders: {
            'X-Firebase-AppCheck': tokenResult.token
          }
        });
        return next.handle(clonedReq);
      })
    );
  }
}

// Register in app.config.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';

providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AppCheckInterceptor, multi: true }
]
```

## Verifying Tokens on Backend

Cloud Functions automatically verify App Check tokens when enforcement is enabled:

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';

// Enforce App Check
export const protectedFunction = functions
  .runWith({ enforceAppCheck: true })
  .https.onCall((data, context) => {
    // Only runs if App Check token is valid
    if (!context.app) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'App Check token missing or invalid'
      );
    }
    
    return { success: true };
  });
```

## Custom Backend Verification

For custom backends, verify tokens manually:

```typescript
// Node.js backend
import { getAppCheck } from 'firebase-admin/app-check';

async function verifyAppCheckToken(req, res, next) {
  const appCheckToken = req.headers['x-firebase-appcheck'];
  
  if (!appCheckToken) {
    return res.status(401).json({ error: 'Missing App Check token' });
  }

  try {
    await getAppCheck().verifyToken(appCheckToken);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid App Check token' });
  }
}
```

## Environment-Based Configuration

```typescript
import { environment } from '../environments/environment';

provideAppCheck(() => {
  const provider = environment.production
    ? new ReCaptchaEnterpriseProvider(environment.recaptchaEnterpriseKey)
    : new ReCaptchaV3Provider(environment.recaptchaV3Key);

  if (!environment.production) {
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  return initializeAppCheck(getApp(), {
    provider,
    isTokenAutoRefreshEnabled: true
  });
}),
```

## Best Practices

1. **Use ReCaptcha Enterprise in production** for better bot detection
2. **Enable debug tokens only in development** to avoid exposing them
3. **Enforce App Check on all sensitive endpoints**
4. **Monitor App Check metrics** in Firebase Console
5. **Gradually roll out enforcement** - start with monitoring before blocking

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/app-check.md
- https://firebase.google.com/docs/app-check
- https://firebase.google.com/docs/reference/js/app-check
-->
