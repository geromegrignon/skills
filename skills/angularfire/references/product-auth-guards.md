---
name: product-auth-guards
description: Angular route guards for Firebase Authentication with customizable pipes
---

# Auth Guards

AngularFire provides pre-built route guards for protecting routes based on authentication state.

## Basic Usage

Use `AngularFireAuthGuard` to protect routes:

```typescript
import { Routes } from '@angular/router';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AngularFireAuthGuard] 
  },
];
```

By default, unauthenticated users cannot navigate to protected routes.

## Built-in Pipes

Customize guard behavior using `authGuardPipe` in route data:

| Pipe | Functionality |
|------|---------------|
| `loggedIn` | Default - rejects unauthenticated users |
| `isNotAnonymous` | Rejects anonymous users |
| `emailVerified` | Rejects users without verified email |
| `hasCustomClaim(claim)` | Rejects users without specific claim |
| `redirectUnauthorizedTo(redirect)` | Redirect unauthenticated users |
| `redirectLoggedInTo(redirect)` | Redirect authenticated users |

## Redirect Examples

```typescript
import { 
  AngularFireAuthGuard, 
  redirectUnauthorizedTo, 
  redirectLoggedInTo,
  hasCustomClaim
} from '@angular/fire/auth-guard';

// Redirect functions
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']);
const adminOnly = () => hasCustomClaim('admin');

export const routes: Routes = [
  // Redirect logged-in users away from login page
  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [AngularFireAuthGuard], 
    data: { authGuardPipe: redirectLoggedInToDashboard }
  },
  // Redirect unauthenticated users to login
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AngularFireAuthGuard], 
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  // Admin-only route
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [AngularFireAuthGuard], 
    data: { authGuardPipe: adminOnly }
  },
];
```

## Using canActivate Helper

Use the `canActivate` helper for cleaner syntax:

```typescript
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']);

export const routes: Routes = [
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToDashboard) },
  { path: 'dashboard', component: DashboardComponent, ...canActivate(redirectUnauthorizedToLogin) },
];
```

## Dynamic Route Guards

Use route parameters in guard logic:

```typescript
import { hasCustomClaim } from '@angular/fire/auth-guard';

// Check if user has claim matching route parameter
const belongsToAccount = (next) => hasCustomClaim(`account-${next.params.id}`);

export const routes: Routes = [
  { 
    path: 'accounts/:id', 
    component: AccountComponent, 
    ...canActivate(belongsToAccount) 
  }
];
```

## Custom Guard Pipes

Create custom pipes using RxJS operators:

```typescript
import { map } from 'rxjs/operators';
import { pipe } from 'rxjs';
import { customClaims } from '@angular/fire/auth-guard';

// Redirect to profile edit or login
const redirectToProfileEditOrLogin = () => map(user => 
  user ? ['profiles', user.uid, 'edit'] : ['login']
);

// Check for specific role
const editorOnly = () => pipe(
  customClaims, 
  map(claims => claims.role === 'editor')
);

// Check if viewing own profile
const onlyAllowSelf = (next) => map(user => 
  !!user && next.params.userId === user.uid
);

export const routes: Routes = [
  { path: 'profile', ...canActivate(redirectToProfileEditOrLogin) },
  { path: 'articles/:id/edit', ...canActivate(editorOnly) },
  { path: 'user/:userId/edit', ...canActivate(onlyAllowSelf) },
];
```

## Role-Based Access Control

Combine custom claims with route guards:

```typescript
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { customClaims, canActivate } from '@angular/fire/auth-guard';

// Check role from custom claims
const hasRole = (role: string) => () => pipe(
  customClaims,
  map(claims => claims?.role === role)
);

// Check account-level admin access
const accountAdmin = (next) => pipe(
  customClaims, 
  map(claims => claims[`account-${next.params.accountId}-role`] === 'admin')
);

export const routes: Routes = [
  { path: 'moderator', ...canActivate(hasRole('moderator')) },
  { path: 'accounts/:accountId/billing', ...canActivate(accountAdmin) },
];
```

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/site/src/auth/route-guards.md
- https://github.com/angular/angularfire/blob/main/docs/compat/auth/router-guards.md
-->
