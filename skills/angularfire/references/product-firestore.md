---
name: product-firestore
description: Cloud Firestore integration with collections, documents, real-time streams, and queries
---

# Cloud Firestore

Cloud Firestore is a flexible, scalable NoSQL database with real-time sync and offline support.

## Setup

```typescript
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    provideFirestore(() => getFirestore()),
  ],
};
```

## Injecting Firestore

```typescript
import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

@Component({...})
export class App {
  private firestore = inject(Firestore);
}
```

## Reading Collections

Use `collection` and `collectionData` for real-time collection streams:

```typescript
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface User {
  id?: string;
  name: string;
  email: string;
}

@Component({
  template: `
    @for (user of users$ | async; track user.id) {
      <div>{{ user.name }}</div>
    }
  `
})
export class Users {
  private firestore = inject(Firestore);
  users$: Observable<User[]>;

  constructor() {
    const usersCollection = collection(this.firestore, 'users');
    // Pass idField to include document ID in results
    this.users$ = collectionData(usersCollection, { idField: 'id' }) as Observable<User[]>;
  }
}
```

## Reading Documents

Use `doc` and `docData` for single document streams:

```typescript
import { Firestore, doc, docData } from '@angular/fire/firestore';

@Component({...})
export class UserDetail {
  private firestore = inject(Firestore);
  user$: Observable<User | undefined>;

  constructor() {
    const userDoc = doc(this.firestore, 'users/user123');
    this.user$ = docData(userDoc, { idField: 'id' }) as Observable<User>;
  }
}
```

## Writing Data

```typescript
import { 
  Firestore, collection, doc, 
  addDoc, setDoc, updateDoc, deleteDoc 
} from '@angular/fire/firestore';

@Component({...})
export class Data {
  private firestore = inject(Firestore);

  // Add new document with auto-generated ID
  async addUser(user: User) {
    const usersCollection = collection(this.firestore, 'users');
    const docRef = await addDoc(usersCollection, user);
    return docRef.id;
  }

  // Set document with specific ID (overwrites)
  async setUser(id: string, user: User) {
    const userDoc = doc(this.firestore, `users/${id}`);
    await setDoc(userDoc, user);
  }

  // Update specific fields (non-destructive)
  async updateUser(id: string, updates: Partial<User>) {
    const userDoc = doc(this.firestore, `users/${id}`);
    await updateDoc(userDoc, updates);
  }

  // Delete document
  async deleteUser(id: string) {
    const userDoc = doc(this.firestore, `users/${id}`);
    await deleteDoc(userDoc);
  }
}
```

## Querying Collections

```typescript
import { 
  Firestore, collection, collectionData,
  query, where, orderBy, limit, startAfter
} from '@angular/fire/firestore';

@Component({...})
export class App {
  private firestore = inject(Firestore);

  getActiveUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(
      usersRef,
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    return collectionData(q, { idField: 'id' }) as Observable<User[]>;
  }
}
```

### Query Operators

| Operator | Usage |
|----------|-------|
| `where` | Filter by field value |
| `orderBy` | Sort results |
| `limit` | Limit result count |
| `startAt/startAfter` | Pagination start |
| `endAt/endBefore` | Pagination end |

### Common Where Operators

- `==`, `!=` - Equality
- `<`, `<=`, `>`, `>=` - Comparison
- `in`, `not-in` - Array membership
- `array-contains`, `array-contains-any` - Array fields

## Subcollections

Access nested collections via path:

```typescript
// Path: users/{userId}/posts/{postId}
const postsRef = collection(this.firestore, `users/${userId}/posts`);
const posts$ = collectionData(postsRef, { idField: 'id' });
```

## Collection Group Queries

Query across all collections with the same name:

```typescript
import { collectionGroup, query, where } from '@angular/fire/firestore';

// Query all 'comments' subcollections across the database
const allComments = collectionGroup(this.firestore, 'comments');
const userComments$ = collectionData(
  query(allComments, where('userId', '==', currentUserId))
);
```

## Snapshot Changes (with Metadata)

For change type metadata (added, modified, removed):

```typescript
import { collection, collectionChanges } from '@angular/fire/firestore';

const changes$ = collectionChanges(collection(this.firestore, 'items'));
changes$.subscribe(changes => {
  changes.forEach(change => {
    console.log(change.type); // 'added' | 'modified' | 'removed'
    console.log(change.doc.data());
  });
});
```

## Offline Persistence

Firestore supports offline data persistence, caching data for offline access:

```typescript
import { 
  provideFirestore, getFirestore, 
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence
} from '@angular/fire/firestore';

provideFirestore(() => {
  const firestore = getFirestore();
  
  // Enable single-tab persistence
  enableIndexedDbPersistence(firestore).catch(err => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence only works in one tab at a time
      console.warn('Persistence failed: multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // Browser doesn't support persistence
      console.warn('Persistence not supported');
    }
  });
  
  return firestore;
}),

// Or enable multi-tab persistence (experimental)
provideFirestore(() => {
  const firestore = getFirestore();
  enableMultiTabIndexedDbPersistence(firestore);
  return firestore;
}),
```

### Checking Data Source

Determine if data came from cache or server:

```typescript
import { collection, onSnapshot } from '@angular/fire/firestore';

const unsubscribe = onSnapshot(
  collection(this.firestore, 'items'),
  { includeMetadataChanges: true },
  (snapshot) => {
    snapshot.docChanges().forEach(change => {
      if (change.doc.metadata.fromCache) {
        console.log('Data from cache');
      } else {
        console.log('Data from server');
      }
    });
  }
);
```

## Firestore Lite

For apps that don't need real-time listeners, use Firestore Lite for smaller bundle size:

```typescript
// Import from firestore/lite instead of firestore
import { provideFirestore, getFirestore } from '@angular/fire/firestore/lite';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore/lite';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    provideFirestore(() => getFirestore()), // Uses lite version
  ],
};

@Component({...})
export class App {
  private firestore = inject(Firestore);

  // Use one-time reads instead of real-time listeners
  async getUsers() {
    const snapshot = await getDocs(collection(this.firestore, 'users'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getUser(id: string) {
    const docSnap = await getDoc(doc(this.firestore, `users/${id}`));
    return docSnap.exists() ? docSnap.data() : null;
  }
}
```

**Firestore Lite limitations:**
- No real-time listeners (`onSnapshot`, `collectionData`, `docData`)
- No offline persistence
- Smaller bundle size (~80% reduction)

**Use Firestore Lite when:**
- You only need one-time reads/writes
- Bundle size is critical
- You don't need offline support

## Emulator Connection

```typescript
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';

provideFirestore(() => {
  const firestore = getFirestore();
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  return firestore;
}),
```

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/firestore.md
- https://github.com/angular/angularfire/blob/main/src/firestore/lite/
- https://firebase.google.com/docs/firestore/quickstart
- https://firebase.google.com/docs/firestore/manage-data/enable-offline
- https://firebase.google.com/docs/reference/js/firestore
-->
