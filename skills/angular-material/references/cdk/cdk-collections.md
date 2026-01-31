---
name: cdk-collections
description: CDK utilities for managing collections including SelectionModel
---

# CDK Collections

## Imports

```ts
import { SelectionModel, SelectionChange } from '@angular/cdk/collections';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
```

Utilities for managing collections, particularly selection state.

## SelectionModel

Manages selection of one or more items from a list.

### Basic Usage

```ts
import {SelectionModel} from '@angular/cdk/collections';

// Single selection
const singleSelection = new SelectionModel<string>(false);

// Multiple selection
const multiSelection = new SelectionModel<string>(true);

// With initial values
const preselected = new SelectionModel<number>(true, [1, 2, 3]);
```

### Selection Operations

```ts
const selection = new SelectionModel<number>(true);

// Select items
selection.select(1);
selection.select(2, 3, 4);  // Multiple at once

// Deselect items
selection.deselect(2);
selection.deselect(3, 4);   // Multiple at once

// Toggle selection
selection.toggle(1);  // Deselects if selected, selects if not

// Clear all selections
selection.clear();

// Check if selected
selection.isSelected(1);  // true/false

// Get selected items
selection.selected;  // number[]

// Check if any selected
selection.hasValue();  // true/false

// Check if empty
selection.isEmpty();  // true/false
```

### Sorted Selection

```ts
const selection = new SelectionModel<number>(true, [3, 1, 2]);
selection.sort();  // Sorts in place
console.log(selection.selected);  // [1, 2, 3]
```

### Change Observable

```ts
selection.changed.subscribe(change => {
  console.log('Added:', change.added);
  console.log('Removed:', change.removed);
  console.log('Source:', change.source);
});
```

## Table Selection Example

```ts
@Component({...})
export class TableWithSelection {
  displayedColumns = ['select', 'name', 'email'];
  dataSource = new MatTableDataSource<User>(USERS);
  selection = new SelectionModel<User>(true, []);

  /** Whether all rows are selected */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Toggle all rows */
  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  /** Checkbox label for accessibility */
  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} ${row.name}`;
  }
}
```

```html
<table mat-table [dataSource]="dataSource">
  <!-- Checkbox Column -->
  <ng-container matColumnDef="select">
    <th mat-header-cell *matHeaderCellDef>
      <mat-checkbox (change)="$event ? toggleAllRows() : null"
                    [checked]="selection.hasValue() && isAllSelected()"
                    [indeterminate]="selection.hasValue() && !isAllSelected()"
                    [aria-label]="checkboxLabel()">
      </mat-checkbox>
    </th>
    <td mat-cell *matCellDef="let row">
      <mat-checkbox (click)="$event.stopPropagation()"
                    (change)="$event ? selection.toggle(row) : null"
                    [checked]="selection.isSelected(row)"
                    [aria-label]="checkboxLabel(row)">
      </mat-checkbox>
    </td>
  </ng-container>

  <!-- Other columns -->
  ...
</table>
```

## List Selection Example

```ts
@Component({...})
export class SelectableList {
  options = ['Option 1', 'Option 2', 'Option 3'];
  selection = new SelectionModel<string>(true);
}
```

```html
<mat-selection-list>
  @for (option of options; track option) {
    <mat-list-option [selected]="selection.isSelected(option)"
                     (click)="selection.toggle(option)">
      {{option}}
    </mat-list-option>
  }
</mat-selection-list>
```

## Single Selection Mode

```ts
const selection = new SelectionModel<string>(false);  // false = single select

selection.select('a');
console.log(selection.selected);  // ['a']

selection.select('b');  // Automatically deselects 'a'
console.log(selection.selected);  // ['b']
```

## Custom Compare Function

For object equality:

```ts
const selection = new SelectionModel<User>(
  true,   // multiple
  [],     // initial
  true,   // emit change events
  (u1, u2) => u1.id === u2.id  // compare function
);
```

## DataSource

Base class for table and tree data sources:

```ts
import {DataSource} from '@angular/cdk/collections';

class MyDataSource extends DataSource<MyData> {
  private dataStream = new BehaviorSubject<MyData[]>([]);

  connect(): Observable<MyData[]> {
    return this.dataStream.asObservable();
  }

  disconnect(): void {
    this.dataStream.complete();
  }

  setData(data: MyData[]) {
    this.dataStream.next(data);
  }
}
```

## Key Points

- `SelectionModel` manages single or multiple selection state
- First constructor param: `true` for multi-select, `false` for single
- Use `changed` observable to react to selection changes
- `toggle()` is convenient for checkbox-style selection
- Custom compare function needed for object equality
- Used by table selection, chip selection, list selection
- `DataSource` pattern separates data logic from display

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/collections/collections.md
- https://material.angular.dev/cdk/collections/overview
-->
