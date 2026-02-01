---
name: product-functions
description: Calling Firebase Cloud Functions from Angular applications
---

# Cloud Functions

Cloud Functions for Firebase lets you call backend functions directly from your Angular app using HTTPS Callable functions.

## Setup

```typescript
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFunctions, getFunctions } from '@angular/fire/functions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    provideFunctions(() => getFunctions()),
  ],
};
```

## Injecting Functions

```typescript
import { Component, inject } from '@angular/core';
import { Functions } from '@angular/fire/functions';

@Component({...})
export class App {
  private functions = inject(Functions);
}
```

## Calling Functions

Use `httpsCallable` to create a callable function reference:

```typescript
import { Functions, httpsCallable } from '@angular/fire/functions';

interface AddMessageRequest {
  text: string;
  userId: string;
}

interface AddMessageResponse {
  messageId: string;
  timestamp: number;
}

@Component({...})
export class App {
  private functions = inject(Functions);

  async addMessage(text: string, userId: string) {
    // Create callable reference
    const addMessageFn = httpsCallable<AddMessageRequest, AddMessageResponse>(
      this.functions, 
      'addMessage'
    );

    try {
      // Call the function
      const result = await addMessageFn({ text, userId });
      console.log('Message ID:', result.data.messageId);
      return result.data;
    } catch (error: any) {
      // Handle errors
      console.error('Function error:', error.code, error.message);
      throw error;
    }
  }
}
```

## Error Handling

Cloud Functions can throw specific error codes:

```typescript
import { Functions, httpsCallable, HttpsCallableResult } from '@angular/fire/functions';

async callFunction() {
  const myFunction = httpsCallable(this.functions, 'myFunction');

  try {
    const result = await myFunction({ data: 'value' });
    return result.data;
  } catch (error: any) {
    // error.code - Firebase error code (e.g., 'functions/unauthenticated')
    // error.message - Error message
    // error.details - Additional error details
    
    switch (error.code) {
      case 'functions/unauthenticated':
        console.error('User must be authenticated');
        break;
      case 'functions/permission-denied':
        console.error('User lacks permission');
        break;
      case 'functions/invalid-argument':
        console.error('Invalid request data');
        break;
      case 'functions/not-found':
        console.error('Function not found');
        break;
      default:
        console.error('Unknown error:', error.message);
    }
    throw error;
  }
}
```

## Callable Function with Region

Specify a different region if your function is deployed outside the default:

```typescript
import { provideFunctions, getFunctions } from '@angular/fire/functions';

// Configure for a specific region
provideFunctions(() => getFunctions(undefined, 'europe-west1')),
```

## Service Pattern

Create a dedicated service for Cloud Functions:

```typescript
import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

interface UserData {
  name: string;
  email: string;
}

interface CreateUserResponse {
  userId: string;
  created: boolean;
}

@Injectable({ providedIn: 'root' })
export class CloudFunctionsService {
  private functions = inject(Functions);

  // Type-safe function wrappers
  createUser(userData: UserData): Promise<CreateUserResponse> {
    const fn = httpsCallable<UserData, CreateUserResponse>(
      this.functions, 
      'createUser'
    );
    return fn(userData).then(result => result.data);
  }

  deleteUser(userId: string): Promise<void> {
    const fn = httpsCallable<{ userId: string }, void>(
      this.functions, 
      'deleteUser'
    );
    return fn({ userId }).then(() => {});
  }

  processPayment(amount: number, currency: string): Promise<{ transactionId: string }> {
    const fn = httpsCallable<
      { amount: number; currency: string }, 
      { transactionId: string }
    >(this.functions, 'processPayment');
    return fn({ amount, currency }).then(result => result.data);
  }
}
```

## Using with RxJS

Convert callable functions to observables:

```typescript
import { from, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FunctionsService {
  private functions = inject(Functions);

  callFunction<TRequest, TResponse>(
    name: string, 
    data: TRequest
  ): Observable<TResponse> {
    const fn = httpsCallable<TRequest, TResponse>(this.functions, name);
    
    return from(fn(data)).pipe(
      map(result => result.data),
      catchError(error => {
        console.error(`Function ${name} error:`, error);
        throw error;
      })
    );
  }
}

// Usage
functionsService.callFunction<{ query: string }, { results: any[] }>('search', { query: 'test' })
  .subscribe(response => console.log(response.results));
```

## Emulator Connection

```typescript
import { connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';

provideFunctions(() => {
  const functions = getFunctions();
  connectFunctionsEmulator(functions, 'localhost', 5001);
  return functions;
}),
```

## Timeout Configuration

For long-running functions, you may need to adjust client-side timeout:

```typescript
import { httpsCallable, HttpsCallableOptions } from '@angular/fire/functions';

const options: HttpsCallableOptions = {
  timeout: 60000 // 60 seconds
};

const longRunningFn = httpsCallable(this.functions, 'longRunningProcess', options);
```

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/functions.md
- https://firebase.google.com/docs/functions/callable
- https://firebase.google.com/docs/reference/js/functions
-->
