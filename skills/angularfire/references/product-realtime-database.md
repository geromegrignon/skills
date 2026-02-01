---
name: product-realtime-database
description: Firebase Realtime Database with lists, objects, queries, and real-time sync
---

# Realtime Database

Firebase Realtime Database is a cloud-hosted NoSQL database that stores data as JSON and syncs in real-time across all connected clients.

## Setup

```typescript
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    provideDatabase(() => getDatabase()),
  ],
};
```

## Injecting Database

```typescript
import { Component, inject } from '@angular/core';
import { Database } from '@angular/fire/database';

@Component({...})
export class App {
  private database = inject(Database);
}
```

## Reading Objects

Use `objectVal` for single object streams:

```typescript
import { Database, ref, objectVal } from '@angular/fire/database';
import { Observable } from 'rxjs';

interface Item {
  name: string;
  size: string;
}

@Component({
  template: `
    @if (item$ | async; as item) {
      <h1>{{ item.name }}</h1>
    }
  `
})
export class ItemComponent {
  private database = inject(Database);
  item$: Observable<Item | null>;

  constructor() {
    const itemRef = ref(this.database, 'item');
    this.item$ = objectVal<Item>(itemRef);
  }
}
```

### Object Observable Functions

| Function | Returns | Use Case |
|----------|---------|----------|
| `object(ref)` | `Observable<QueryChange>` | When you need snapshot metadata |
| `objectVal(ref, options?)` | `Observable<T>` | When you just need the data |

## Reading Lists

Use `listVal` for list streams:

```typescript
import { Database, ref, listVal } from '@angular/fire/database';

@Component({
  template: `
    <ul>
      @for (item of items$ | async; track item.key) {
        <li>{{ item.name }}</li>
      }
    </ul>
  `
})
export class ItemsComponent {
  private database = inject(Database);
  items$: Observable<Item[]>;

  constructor() {
    const itemsRef = ref(this.database, 'items');
    // Include the key in results
    this.items$ = listVal<Item>(itemsRef, { keyField: 'key' });
  }
}
```

### List Observable Functions

| Function | Returns | Use Case |
|----------|---------|----------|
| `list(ref, options?)` | `Observable<QueryChange[]>` | Sorted array with metadata |
| `listVal(ref, options?)` | `Observable<T[]>` | Simple array of values |
| `stateChanges(ref, options?)` | `Observable<QueryChange>` | Individual change events |
| `auditTrail(ref, options?)` | `Observable<QueryChange[]>` | Complete trail of changes |

## Writing Data

```typescript
import { 
  Database, ref, 
  set, update, remove, push 
} from '@angular/fire/database';

@Component({...})
export class DataComponent {
  private database = inject(Database);

  // Set data (destructive - overwrites everything)
  async setItem(item: Item) {
    const itemRef = ref(this.database, 'item');
    await set(itemRef, item);
  }

  // Update data (non-destructive - merges)
  async updateItem(updates: Partial<Item>) {
    const itemRef = ref(this.database, 'item');
    await update(itemRef, updates);
  }

  // Remove data
  async removeItem() {
    const itemRef = ref(this.database, 'item');
    await remove(itemRef);
  }

  // Push new item to list (generates unique key)
  async addItem(item: Item) {
    const itemsRef = ref(this.database, 'items');
    const newRef = push(itemsRef);
    await set(newRef, item);
    return newRef.key;
  }
}
```

## Querying Lists

```typescript
import { 
  Database, ref, query,
  orderByChild, orderByKey, orderByValue,
  equalTo, startAt, endAt,
  limitToFirst, limitToLast,
  listVal
} from '@angular/fire/database';

@Component({...})
export class QueryComponent {
  private database = inject(Database);

  // Filter by child value
  getLargeItems(): Observable<Item[]> {
    const itemsRef = ref(this.database, 'items');
    const q = query(
      itemsRef, 
      orderByChild('size'), 
      equalTo('large')
    );
    return listVal<Item>(q);
  }

  // Limit results
  getRecentItems(count: number): Observable<Item[]> {
    const itemsRef = ref(this.database, 'items');
    const q = query(
      itemsRef,
      orderByChild('timestamp'),
      limitToLast(count)
    );
    return listVal<Item>(q);
  }

  // Range query
  getItemsInRange(start: string, end: string): Observable<Item[]> {
    const itemsRef = ref(this.database, 'items');
    const q = query(
      itemsRef,
      orderByChild('name'),
      startAt(start),
      endAt(end)
    );
    return listVal<Item>(q);
  }
}
```

### Query Options

| Method | Purpose |
|--------|---------|
| `orderByChild(key)` | Order by child field |
| `orderByKey()` | Order by key |
| `orderByValue()` | Order by value (for primitive lists) |
| `equalTo(value)` | Filter to exact value |
| `startAt(value)` | Start at value (inclusive) |
| `endAt(value)` | End at value (inclusive) |
| `limitToFirst(n)` | First n results |
| `limitToLast(n)` | Last n results |

**Note:** Can only use one `orderBy` method per query. Cannot combine `limitToFirst` and `limitToLast`.

## Dynamic Queries with RxJS

```typescript
import { switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({...})
export class DynamicQueryComponent {
  private database = inject(Database);
  
  size$ = new BehaviorSubject<string | null>(null);
  items$: Observable<Item[]>;

  constructor() {
    this.items$ = this.size$.pipe(
      switchMap(size => {
        const itemsRef = ref(this.database, 'items');
        const q = size 
          ? query(itemsRef, orderByChild('size'), equalTo(size))
          : itemsRef;
        return listVal<Item>(q);
      })
    );
  }

  filterBySize(size: string | null) {
    this.size$.next(size);
  }
}
```

## Multiple Database Instances

```typescript
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { DatabaseInstances } from '@angular/fire/database';

const SHARD_URLS = [
  'https://project-shard1.firebaseio.com',
  'https://project-shard2.firebaseio.com',
];

// Configure multiple databases
providers: [
  provideDatabase(() => getDatabase(undefined, SHARD_URLS[0])),
  provideDatabase(() => getDatabase(undefined, SHARD_URLS[1])),
]

// Inject all instances
class MyService {
  constructor(private databases: DatabaseInstances) {
    // databases is Database[]
  }
}
```

## Emulator Connection

```typescript
import { connectDatabaseEmulator, getDatabase, provideDatabase } from '@angular/fire/database';

provideDatabase(() => {
  const database = getDatabase();
  connectDatabaseEmulator(database, 'localhost', 9000);
  return database;
}),
```

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/database.md
- https://github.com/angular/angularfire/blob/main/site/src/rtdb/lists.md
- https://github.com/angular/angularfire/blob/main/site/src/rtdb/objects.md
- https://github.com/angular/angularfire/blob/main/site/src/rtdb/querying.md
-->
