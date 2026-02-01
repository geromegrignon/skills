---
name: product-auth
description: Firebase Authentication with observables, auth state management, and SSR support
---

# Firebase Authentication

Firebase Authentication provides backend services and SDKs to authenticate users with passwords, phone numbers, and federated identity providers.

## Setup

```typescript
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    provideAuth(() => getAuth()),
  ],
};
```

## Injecting Auth

```typescript
import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Component({...})
export class Auth {
  private auth = inject(Auth);
}
```

## Auth State Observables

AngularFire provides RxJS observables for auth state:

### `user` Observable

Streams events for sign-in, sign-out, and token refresh:

```typescript
import { Auth, User, user } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({...})
export class User {
  private auth = inject(Auth);
  user$ = user(this.auth);

  constructor() {
    this.user$
    .pipe(takeUntilDestroyed())
    .subscribe((currentUser: User | null) => {
      if (currentUser) {
        console.log('User:', currentUser.email);
      } else {
        console.log('No user signed in');
      }
    });
  }
}
```

### `authState` Observable

Streams events for sign-in and sign-out only (no token refresh):

```typescript
import { Auth, authState } from '@angular/fire/auth';

@Component({
  template: `
    @if (authState$ | async; as user) {
      <p>Welcome, {{ user.email }}</p>
    } @else {
      <p>Please sign in</p>
    }
  `
})
export class AuthState {
  private auth = inject(Auth);
  authState$ = authState(this.auth);
}
```

### `idToken` Observable

Streams the ID token string:

```typescript
import { Auth, idToken } from '@angular/fire/auth';

@Component({...})
export class Token {
  private auth = inject(Auth);
  idToken$ = idToken(this.auth);

  constructor() {
    this.idToken$.subscribe((token: string | null) => {
      // Use token for API calls
    });
  }
}
```

## Sign In Methods

```typescript
import { 
  Auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from '@angular/fire/auth';

@Component({...})
export class Login {
  private auth = inject(Auth);

  // Email/Password sign in
  async signIn(email: string, password: string) {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      return credential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Create new account
  async signUp(email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  // Google sign in
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    return credential.user;
  }

  // Sign out
  async signOut() {
    await signOut(this.auth);
  }
}
```

## Server-Side Rendering Support

For SSR with auth context, use `FirebaseServerApp`:

```typescript
import { ApplicationConfig, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { REQUEST } from '@angular/ssr';
import { 
  provideFirebaseApp, initializeApp, initializeServerApp, FirebaseApp 
} from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => {
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        return initializeApp(firebaseConfig);
      }
      // Server-side: use FirebaseServerApp
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

## Emulator Connection

```typescript
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';

provideAuth(() => {
  const auth = getAuth();
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  return auth;
}),
```

## Common Auth Operations

```typescript
import {
  Auth,
  updateProfile,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser
} from '@angular/fire/auth';

// Update user profile
await updateProfile(auth.currentUser!, { displayName: 'New Name' });

// Send password reset email
await sendPasswordResetEmail(auth, 'user@example.com');

// Send email verification
await sendEmailVerification(auth.currentUser!);
```

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/auth.md
- https://firebase.google.com/docs/auth/web/start
- https://firebase.google.com/docs/reference/js/auth
-->
