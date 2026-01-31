---
name: component-table
description: Material Design data table with sorting, pagination, and filtering
---

# MatTable

## Imports

```ts
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

// For selection
import { SelectionModel } from '@angular/cdk/collections';

// For virtual scrolling with large data
import { ScrollingModule } from '@angular/cdk/scrolling';
```

The `mat-table` provides a Material Design styled data table built on the CDK table.

## Basic Table

```html
<table mat-table [dataSource]="dataSource">
  <!-- Name Column -->
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef>Name</th>
    <td mat-cell *matCellDef="let user">{{user.name}}</td>
  </ng-container>

  <!-- Email Column -->
  <ng-container matColumnDef="email">
    <th mat-header-cell *matHeaderCellDef>Email</th>
    <td mat-cell *matCellDef="let user">{{user.email}}</td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
</table>
```

```ts
displayedColumns = ['name', 'email'];
dataSource = new MatTableDataSource(this.users);
```

## Simple Text Column

For columns displaying a single property:

```html
<mat-text-column name="email" />

<!-- With custom header -->
<mat-text-column name="email" headerText="Email Address" />
```

## MatTableDataSource

Built-in data source with sorting, pagination, and filtering:

```ts
import {MatTableDataSource} from '@angular/material/table';

dataSource = new MatTableDataSource<User>();

constructor() {
  this.dataSource.data = this.users;
}
```

## Sorting

```html
<table mat-table [dataSource]="dataSource" matSort>
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
    <td mat-cell *matCellDef="let user">{{user.name}}</td>
  </ng-container>
  ...
</table>
```

```ts
import {MatSort} from '@angular/material/sort';

sort = viewChild.required<MatSort>(MatSort);

constructor() {
  afterNextRender(() => {
    this.dataSource.sort = this.sort();
  });
}
```

### Custom Sort Accessor

```ts
this.dataSource.sortingDataAccessor = (item, property) => {
  switch (property) {
    case 'fullName': return item.firstName + ' ' + item.lastName;
    case 'date': return new Date(item.dateString).getTime();
    default: return item[property];
  }
};
```

## Pagination

```html
<table mat-table [dataSource]="dataSource">
  ...
</table>
<mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons />
```

```ts
import {MatPaginator} from '@angular/material/paginator';

paginator = viewChild.required<MatPaginator>(MatPaginator);

constructor() {
  afterNextRender(() => {
    this.dataSource.paginator = this.paginator();
  });
}
```

## Filtering

```html
<mat-form-field>
  <mat-label>Filter</mat-label>
  <input matInput (keyup)="applyFilter($event)">
</mat-form-field>

<table mat-table [dataSource]="dataSource">
  ...
  <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
  <tr class="mat-row" *matNoDataRow>
    <td class="mat-cell" colspan="4">No data matching "{{filterValue}}"</td>
  </tr>
</table>
```

```ts
filterValue = '';

applyFilter(event: Event): void {
  this.filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = this.filterValue.trim().toLowerCase();
}
```

### Custom Filter Predicate

```ts
this.dataSource.filterPredicate = (data: User, filter: string) => {
  return data.name.toLowerCase().includes(filter) ||
         data.email.toLowerCase().includes(filter);
};
```

## Selection

```ts
import {SelectionModel} from '@angular/cdk/collections';

selection = new SelectionModel<User>(true, []); // Multi-select

isAllSelected(): boolean {
  return this.selection.selected.length === this.dataSource.data.length;
}

toggleAllRows(): void {
  this.isAllSelected()
    ? this.selection.clear()
    : this.dataSource.data.forEach(row => this.selection.select(row));
}
```

```html
<ng-container matColumnDef="select">
  <th mat-header-cell *matHeaderCellDef>
    <mat-checkbox (change)="$event ? toggleAllRows() : null"
                  [checked]="selection.hasValue() && isAllSelected()"
                  [indeterminate]="selection.hasValue() && !isAllSelected()">
    </mat-checkbox>
  </th>
  <td mat-cell *matCellDef="let row">
    <mat-checkbox (click)="$event.stopPropagation()"
                  (change)="$event ? selection.toggle(row) : null"
                  [checked]="selection.isSelected(row)">
    </mat-checkbox>
  </td>
</ng-container>
```

## Sticky Header/Footer/Columns

```html
<!-- Sticky header -->
<tr mat-header-row *matHeaderRowDef="columns; sticky: true"></tr>

<!-- Sticky footer -->
<tr mat-footer-row *matFooterRowDef="columns; sticky: true"></tr>

<!-- Sticky column (left) -->
<ng-container matColumnDef="name" sticky>
  ...
</ng-container>

<!-- Sticky column (right) -->
<ng-container matColumnDef="actions" stickyEnd>
  ...
</ng-container>
```

## Footer Row

```html
<ng-container matColumnDef="cost">
  <th mat-header-cell *matHeaderCellDef>Cost</th>
  <td mat-cell *matCellDef="let item">{{item.cost | currency}}</td>
  <td mat-footer-cell *matFooterCellDef>{{totalCost | currency}}</td>
</ng-container>

<tr mat-header-row *matHeaderRowDef="columns"></tr>
<tr mat-row *matRowDef="let row; columns: columns"></tr>
<tr mat-footer-row *matFooterRowDef="columns"></tr>
```

## Row Click Events

```html
<tr mat-row *matRowDef="let row; columns: columns"
    (click)="onRowClick(row)"
    [class.selected]="selection.isSelected(row)">
</tr>
```

## Virtual Scrolling (Large Data)

```html
<cdk-virtual-scroll-viewport itemSize="48" class="table-viewport">
  <table mat-table [dataSource]="dataSource">
    ...
  </table>
</cdk-virtual-scroll-viewport>
```

```scss
.table-viewport {
  height: 400px;
}
```

## Column Styling

```scss
/* Target by column name */
.mat-column-name {
  flex: 0 0 200px;
}

.mat-column-actions {
  text-align: right;
}

/* Selection column overflow for ripple */
.mat-column-select {
  overflow: initial;
}
```

## Flex Layout Table

Alternative to native `<table>`:

```html
<mat-table [dataSource]="dataSource">
  <ng-container matColumnDef="name">
    <mat-header-cell *matHeaderCellDef>Name</mat-header-cell>
    <mat-cell *matCellDef="let user">{{user.name}}</mat-cell>
  </ng-container>
  
  <mat-header-row *matHeaderRowDef="columns" />
  <mat-row *matRowDef="let row; columns: columns" />
</mat-table>
```

## Accessibility

```html
<table mat-table [dataSource]="dataSource" 
       aria-label="User list"
       role="table">
```

## Key Points

- `MatTableDataSource` handles sorting, pagination, filtering automatically
- Connect `MatSort` and `MatPaginator` in `ngAfterViewInit` after ViewChild resolves
- Use `trackBy` for performance with changing data
- `*matNoDataRow` shows content when filter returns no results
- Avoid recreating `MatTableDataSource`; update `.data` property instead
- Sticky elements work best with `fixedLayout`
- Flex layout loses colspan/rowspan but gains CSS flexibility

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/table/table.md
- https://material.angular.dev/components/table/overview
-->
