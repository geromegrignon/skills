---
name: component-sort
description: Sortable column headers for tables
---

# Sort

## Imports

```ts
import { MatSortModule, MatSort, Sort, SortDirection } from '@angular/material/sort';

// For accessibility announcements
import { LiveAnnouncer } from '@angular/cdk/a11y';
```

Add sorting behavior to table headers.

## Basic Usage

```html
<table mat-table [dataSource]="dataSource" matSort (matSortChange)="onSort($event)">
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
    <td mat-cell *matCellDef="let row">{{row.name}}</td>
  </ng-container>
  
  <ng-container matColumnDef="age">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Age</th>
    <td mat-cell *matCellDef="let row">{{row.age}}</td>
  </ng-container>
  
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
```

```ts
onSort(sort: Sort): void {
  console.log('Active column:', sort.active);
  console.log('Direction:', sort.direction);  // 'asc', 'desc', or ''
}
```

## With MatTableDataSource

Automatic client-side sorting:

```ts
sort = viewChild.required<MatSort>(MatSort);

constructor() {
  afterNextRender(() => {
    this.dataSource.sort = this.sort();
  });
}
```

## Sort Header Options

```html
<th mat-header-cell mat-sort-header
    sortActionDescription="Sort by name"
    start="desc"
    [disableClear]="true">
  Name
</th>
```

| Option | Description |
|--------|-------------|
| `start` | Initial sort direction (`asc` or `desc`) |
| `disableClear` | Prevent clearing sort |
| `sortActionDescription` | Accessibility description |

## Global Sort Configuration

```html
<table matSort 
       matSortStart="desc"
       matSortDisableClear>
```

## Disabled Sorting

```html
<!-- Disable entire table sorting -->
<table matSort [matSortDisabled]="true">

<!-- Disable specific column -->
<th mat-sort-header [disabled]="true">Fixed Column</th>
```

## Default Sort

```html
<table matSort matSortActive="name" matSortDirection="asc">
```

## Sort Change Event

```ts
interface Sort {
  active: string;    // Column ID
  direction: SortDirection;  // 'asc' | 'desc' | ''
}
```

## Server-Side Sorting

```ts
@Component({...})
export class ServerSortedTable {
  dataSource = signal<User[]>([]);
  
  sort = viewChild.required<MatSort>(MatSort);

  constructor() {
    afterNextRender(() => {
      this.sort().sortChange.subscribe((sort: Sort) => {
      this.loadData(sort.active, sort.direction);
    });
  }

  loadData(sortField: string, sortDirection: string): void {
    this.userService.getUsers({
      sortBy: sortField,
      order: sortDirection
    }).subscribe(users => {
      this.dataSource.set(users);
    });
  }
}
```

## Custom Sort Logic

For `MatTableDataSource`:

```ts
this.dataSource.sortingDataAccessor = (item, property) => {
  switch (property) {
    case 'fullName':
      return `${item.firstName} ${item.lastName}`;
    case 'date':
      return new Date(item.date).getTime();
    default:
      return item[property];
  }
};
```

## Custom Sort Icon

```html
<th mat-header-cell mat-sort-header>
  Name
  <ng-template matSortHeaderIcon let-sortDirection>
    @switch (sortDirection) {
      @case ('asc') {
        <mat-icon>arrow_upward</mat-icon>
      }
      @case ('desc') {
        <mat-icon>arrow_downward</mat-icon>
      }
      @default {
        <mat-icon>unfold_more</mat-icon>
      }
    }
  </ng-template>
</th>
```

## Programmatic Sorting

```ts
sort = viewChild.required<MatSort>(MatSort);

sortByName(): void {
  this.sort().sort({id: 'name', start: 'asc', disableClear: false});
}

clearSort(): void {
  this.sort().sort({id: '', start: 'asc', disableClear: false});
}
```

## Accessibility

Always provide `sortActionDescription`:

```html
<th mat-header-cell mat-sort-header
    sortActionDescription="Sort by user name">
  Name
</th>
```

For screen readers, announce sort changes:

```ts
import {LiveAnnouncer} from '@angular/cdk/a11y';

liveAnnouncer = inject(LiveAnnouncer);

onSortChange(sort: Sort): void {
  if (sort.direction) {
    this.liveAnnouncer().announce(`Sorted ${sort.direction}ending by ${sort.active}`);
  } else {
    this.liveAnnouncer().announce('Sorting cleared');
  }
}
```

## Sort Cycle

Default: `asc` → `desc` → (clear)

Change starting direction:

```html
<!-- Start descending -->
<th mat-sort-header start="desc">Column</th>

<!-- Never clear (toggle between asc/desc) -->
<th mat-sort-header [disableClear]="true">Column</th>
```

## Key Points

- Add `matSort` to table, `mat-sort-header` to columns
- Assign `dataSource.sort` for automatic client-side sorting
- Use `(matSortChange)` for server-side sorting
- `start`: initial direction, `disableClear`: prevent clearing
- `sortingDataAccessor` for custom sort logic
- Provide `sortActionDescription` for accessibility
- Use `LiveAnnouncer` to announce sort changes

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/sort/sort.md
- https://material.angular.dev/components/sort/overview
-->
