---
name: cdk-table
description: CDK data table foundation with templating and DataSource pattern
---

# CDK Table

## Imports

```ts
import { CdkTableModule, CdkTable } from '@angular/cdk/table';
import { DataSource } from '@angular/cdk/collections';
```

The CDK table is an unopinionated, customizable data table that serves as the foundation for `mat-table`.

## Basic Structure

```html
<table cdk-table [dataSource]="dataSource">
  <!-- Column Definition -->
  <ng-container cdkColumnDef="username">
    <th cdk-header-cell *cdkHeaderCellDef>User name</th>
    <td cdk-cell *cdkCellDef="let row">{{row.username}}</td>
    <td cdk-footer-cell *cdkFooterCellDef>Total</td>
  </ng-container>

  <ng-container cdkColumnDef="age">
    <th cdk-header-cell *cdkHeaderCellDef>Age</th>
    <td cdk-cell *cdkCellDef="let row">{{row.age}}</td>
  </ng-container>

  <!-- Row Definitions -->
  <tr cdk-header-row *cdkHeaderRowDef="['username', 'age']"></tr>
  <tr cdk-row *cdkRowDef="let row; columns: ['username', 'age']"></tr>
  <tr cdk-footer-row *cdkFooterRowDef="['username', 'age']"></tr>
</table>
```

## Column Definitions

Each column needs a unique name via `cdkColumnDef`:

```html
<ng-container cdkColumnDef="status">
  <th cdk-header-cell *cdkHeaderCellDef>Status</th>
  <td cdk-cell *cdkCellDef="let row">
    <!-- Full template access -->
    <span [class.active]="row.isActive">{{row.status}}</span>
  </td>
</ng-container>
```

### Cell Template Context

`*cdkCellDef` exports the same variables as `*ngFor`:

```html
<td cdk-cell *cdkCellDef="let row; let i = index; let even = even">
  {{i}}: {{row.name}} {{even ? '(even)' : ''}}
</td>
```

## Row Definitions

### Dynamic Columns

```ts
displayedColumns = ['name', 'age', 'email'];

// Change at runtime
toggleColumn(column: string): void {
  const index = this.displayedColumns.indexOf(column);
  if (index > -1) {
    this.displayedColumns.splice(index, 1);
  } else {
    this.displayedColumns.push(column);
  }
}
```

```html
<tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
<tr cdk-row *cdkRowDef="let row; columns: displayedColumns"></tr>
```

### Row Event Binding

```html
<tr cdk-row *cdkRowDef="let row; columns: displayedColumns"
    [class.selected]="selection.isSelected(row)"
    (click)="onRowClick(row)">
</tr>
```

## Data Sources

### Array (Simple)

```html
<table cdk-table [dataSource]="myArray">
```

Call `renderRows()` after mutations:

```ts
this.myArray.push(newItem);
this.table.renderRows();
```

### Observable

```ts
dataSource$ = this.http.get<User[]>('/api/users');
```

```html
<table cdk-table [dataSource]="dataSource$">
```

### DataSource Class (Recommended)

```ts
import {DataSource} from '@angular/cdk/collections';

class MyDataSource extends DataSource<User> {
  private dataSubject = new BehaviorSubject<User[]>([]);
  
  connect(): Observable<User[]> {
    return this.dataSubject.asObservable();
  }
  
  disconnect(): void {
    this.dataSubject.complete();
  }
  
  loadData(): void {
    this.api.getUsers().subscribe(data => {
      this.dataSubject.next(data);
    });
  }
}
```

## Performance Optimization

### trackBy

```html
<table cdk-table [dataSource]="dataSource" [trackBy]="trackById">
```

```ts
trackById(index: number, item: User): number {
  return item.id;
}
```

### fixedLayout

Enforces uniform column widths for better sticky performance:

```html
<table cdk-table [dataSource]="dataSource" fixedLayout>
```

### recycleRows

Reuse row views instead of recreating:

```html
<table cdk-table [dataSource]="dataSource" recycleRows>
```

Note: Disables row animations and `cdkRowDefWhen` conditional templates.

## Virtual Scrolling

For large datasets:

```html
<cdk-virtual-scroll-viewport itemSize="48" class="viewport">
  <table cdk-table [dataSource]="dataSource">
    <!-- columns... -->
    <tr cdk-header-row *cdkHeaderRowDef="columns"></tr>
    <tr cdk-row *cdkRowDef="let row; columns: columns"></tr>
  </table>
</cdk-virtual-scroll-viewport>
```

Limitations:
- `fixedLayout` is always enabled
- `cdkRowDefWhen` conditional templates not supported

## CSS Styling

Each cell gets a class based on column name:

```scss
.cdk-column-username {
  width: 200px;
}

.cdk-column-actions {
  text-align: right;
}
```

## Flex Layout Alternative

Replace native table elements with CDK directives:

```html
<cdk-table [dataSource]="dataSource">
  <ng-container cdkColumnDef="username">
    <cdk-header-cell *cdkHeaderCellDef>User name</cdk-header-cell>
    <cdk-cell *cdkCellDef="let row">{{row.username}}</cdk-cell>
  </ng-container>

  <cdk-header-row *cdkHeaderRowDef="displayedColumns" />
  <cdk-row *cdkRowDef="let row; columns: displayedColumns" />
</cdk-table>
```

## Key Points

- Column order is determined by the array passed to row definitions, not template order
- Not all defined columns need to be displayed
- `DataSource` pattern encapsulates sorting, filtering, pagination logic
- Use `trackBy` for better performance with changing data
- `fixedLayout` improves sticky element performance
- `recycleRows` reuses views but disables animations
- Flex layout variant allows full CSS control but loses colspan/rowspan

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/table/table.md
- https://material.angular.dev/cdk/table/overview
-->
