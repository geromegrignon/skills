---
name: cdk-drag-drop
description: CDK drag and drop for reordering lists and transferring items
---

# CDK Drag and Drop

## Imports

```ts
import { DragDropModule, CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
```

Drag and drop functionality for reordering and transferring items.

## Basic Draggable

```html
<div cdkDrag>Drag me</div>
```

## Drag Handle

Restrict drag initiation to a handle:

```html
<div cdkDrag>
  <mat-icon cdkDragHandle>drag_indicator</mat-icon>
  Drag by the icon
</div>
```

## Sortable List

```html
<div cdkDropList (cdkDropListDropped)="drop($event)">
  @for (item of items; track item) {
    <div cdkDrag>{{item}}</div>
  }
</div>
```

```ts
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

drop(event: CdkDragDrop<string[]>): void {
  moveItemInArray(this.items, event.previousIndex, event.currentIndex);
}
```

## Transfer Between Lists

```html
<div class="container">
  <div cdkDropList #todoList="cdkDropList"
       [cdkDropListData]="todo"
       [cdkDropListConnectedTo]="[doneList]"
       (cdkDropListDropped)="drop($event)">
    @for (item of todo; track item) {
      <div cdkDrag>{{item}}</div>
    }
  </div>

  <div cdkDropList #doneList="cdkDropList"
       [cdkDropListData]="done"
       [cdkDropListConnectedTo]="[todoList]"
       (cdkDropListDropped)="drop($event)">
    @for (item of done; track item) {
      <div cdkDrag>{{item}}</div>
    }
  </div>
</div>
```

```ts
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

todo = ['Task 1', 'Task 2'];
done = ['Task 3'];

drop(event: CdkDragDrop<string[]>): void {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
```

## Drop List Groups

Connect all lists in a group:

```html
<div cdkDropListGroup>
  <div cdkDropList [cdkDropListData]="list1">...</div>
  <div cdkDropList [cdkDropListData]="list2">...</div>
  <div cdkDropList [cdkDropListData]="list3">...</div>
</div>
```

## Drag Preview

Custom preview while dragging:

```html
<div cdkDrag>
  Item content
  <ng-template cdkDragPreview>
    <div class="custom-preview">Dragging...</div>
  </ng-template>
</div>
```

Match preview size to original:

```html
<ng-template cdkDragPreview matchSize>
  <div class="preview">Preview</div>
</ng-template>
```

## Placeholder

Custom placeholder in list:

```html
<div cdkDrag>
  Content
  <div *cdkDragPlaceholder class="placeholder">Drop here</div>
</div>
```

## Constrain Movement

### Lock to Axis

```html
<div cdkDrag cdkDragLockAxis="x">Horizontal only</div>
<div cdkDrag cdkDragLockAxis="y">Vertical only</div>
```

### Constrain to Element

```html
<div #boundary class="boundary">
  <div cdkDrag [cdkDragBoundary]="boundary">
    Constrained to boundary
  </div>
</div>
```

## Disable Drag

```html
<div cdkDrag [cdkDragDisabled]="isDisabled">
  Conditionally draggable
</div>
```

## Sorting Direction

```html
<!-- Vertical (default) -->
<div cdkDropList cdkDropListOrientation="vertical">

<!-- Horizontal -->
<div cdkDropList cdkDropListOrientation="horizontal">
```

## Enter Predicate

Control what can be dropped:

```html
<div cdkDropList [cdkDropListEnterPredicate]="canDrop">
```

```ts
canDrop = (drag: CdkDrag, drop: CdkDropList) => {
  return drag.data.type === 'allowed';
};
```

## Sort Predicate

Control reordering:

```html
<div cdkDropList [cdkDropListSortPredicate]="canSort">
```

```ts
canSort = (index: number, drag: CdkDrag, drop: CdkDropList) => {
  return index !== 0;  // Can't move to first position
};
```

## Events

```html
<div cdkDrag
     (cdkDragStarted)="onDragStart($event)"
     (cdkDragMoved)="onDragMove($event)"
     (cdkDragEnded)="onDragEnd($event)"
     (cdkDragDropped)="onDrop($event)">
</div>

<div cdkDropList
     (cdkDropListEntered)="onEntered($event)"
     (cdkDropListExited)="onExited($event)"
     (cdkDropListDropped)="onDropped($event)"
     (cdkDropListSorted)="onSorted($event)">
</div>
```

## Programmatic Drag Data

```html
<div cdkDrag [cdkDragData]="item">{{item.name}}</div>
```

```ts
drop(event: CdkDragDrop<Item>): void {
  console.log('Dropped item:', event.item.data);
}
```

## Free Dragging Position

```html
<div cdkDrag [cdkDragFreeDragPosition]="dragPosition">
```

```ts
dragPosition = {x: 100, y: 50};
```

Reset position:

```ts
drag = viewChild.required<CdkDrag>(CdkDrag);

resetPosition(): void {
  this.drag().reset();
}
```

## Styling

```scss
// Dragging element
.cdk-drag-dragging {
  opacity: 0.5;
}

// Placeholder
.cdk-drag-placeholder {
  background: #ccc;
}

// Preview
.cdk-drag-preview {
  box-shadow: 0 5px 5px rgba(0,0,0,0.2);
}

// Animation when items settle
.cdk-drag-animating {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}
```

## Key Points

- `cdkDrag` makes element draggable
- `cdkDropList` creates a drop zone
- `cdkDragHandle` restricts drag start point
- Use `moveItemInArray` for reordering
- Use `transferArrayItem` for list-to-list transfers
- `cdkDropListConnectedTo` links multiple lists
- `cdkDragPreview` and `cdkDragPlaceholder` for custom UI
- Control with predicates: `cdkDropListEnterPredicate`, `cdkDropListSortPredicate`

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/drag-drop/drag-drop.md
- https://material.angular.dev/cdk/drag-drop/overview
-->
