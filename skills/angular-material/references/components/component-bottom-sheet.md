---
name: component-bottom-sheet
description: Modal panels sliding up from the bottom of the screen
---

# Bottom Sheet

## Imports

```ts
import { 
  MatBottomSheetModule, 
  MatBottomSheet, 
  MatBottomSheetRef, 
  MAT_BOTTOM_SHEET_DATA,
  MAT_BOTTOM_SHEET_DEFAULT_OPTIONS 
} from '@angular/material/bottom-sheet';
```

Modal panels that slide up from the bottom, primarily for mobile interactions.

## Basic Usage

```ts
import {MatBottomSheet} from '@angular/material/bottom-sheet';

private bottomSheet = inject(MatBottomSheet);

openSheet(): void {
  this.bottomSheet.open(ShareSheetComponent);
}
```

## Configuration

```ts
const sheetRef = this.bottomSheet.open(ShareSheetComponent, {
  ariaLabel: 'Share options',
  hasBackdrop: true,
  backdropClass: 'custom-backdrop',
  panelClass: 'custom-panel',
  disableClose: false,
  autoFocus: 'first-tabbable',
  restoreFocus: true,
  data: {item: this.selectedItem}
});
```

## Passing Data

```ts
// Opening component
this.bottomSheet.open(DetailSheetComponent, {
  data: {name: 'John', id: 123}
});
```

```ts
// Sheet component
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({...})
export class DetailSheet {
  private sheetRef = inject(MatBottomSheetRef<DetailSheetComponent>);
  data = inject(MAT_BOTTOM_SHEET_DATA);

  close(): void {
    this.sheetRef.dismiss('result value');
  }
}
```

## Bottom Sheet Reference

```ts
const sheetRef = this.bottomSheet.open(MySheetComponent);

// Dismiss programmatically
sheetRef.dismiss('optional result');

// Listen for dismissal
sheetRef.afterDismissed().subscribe(result => {
  console.log('Dismissed with:', result);
});

// Listen for open
sheetRef.afterOpened().subscribe(() => {
  console.log('Sheet opened');
});

// Listen for backdrop clicks
sheetRef.backdropClick().subscribe(() => {
  console.log('Backdrop clicked');
});

// Listen for keyboard events
sheetRef.keydownEvents().subscribe(event => {
  if (event.key === 'Escape') {
    console.log('Escape pressed');
  }
});
```

## Global Defaults

```ts
@NgModule({
  providers: [
    {
      provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: {hasBackdrop: true, disableClose: false}
    }
  ]
})
```

## Focus Management

| Value | Behavior |
|-------|----------|
| `first-tabbable` | Focus first tabbable element (default) |
| `first-header` | Focus first heading (`h1`-`h6`) |
| `dialog` | Focus the sheet container |
| CSS selector | Focus element matching selector |

```ts
this.bottomSheet.open(MySheet, {
  autoFocus: '#my-input'  // Focus specific element
});
```

## Preventing Close

```ts
this.bottomSheet.open(ImportantSheet, {
  disableClose: true  // Prevent ESC and backdrop click from closing
});
```

Handle close attempts in the sheet:

```ts
@Component({...})
export class ImportantSheet {
  private sheetRef = inject(MatBottomSheetRef<ImportantSheet>);

  attemptClose(): void {
    if (this.canClose()) {
      this.sheetRef.dismiss();
    } else {
      this.showWarning();
    }
  }
}
```

## Sheet Content Template

```html
<div class="share-sheet">
  <h2>Share via</h2>
  <mat-nav-list>
    <a mat-list-item (click)="share('email')">
      <mat-icon>email</mat-icon>
      <span>Email</span>
    </a>
    <a mat-list-item (click)="share('twitter')">
      <mat-icon>share</mat-icon>
      <span>Twitter</span>
    </a>
  </mat-nav-list>
</div>
```

## Accessibility

- Always provide `ariaLabel` for the sheet
- ESC key closes by default (don't disable without good reason)
- Focus is trapped inside the sheet
- Focus returns to trigger element on close
- Handle focus restoration when trigger element is removed

```ts
const sheetRef = this.bottomSheet.open(FileChooserSheet, {
  ariaLabel: 'Choose file type'
});

sheetRef.afterDismissed().subscribe(() => {
  // Restore focus if original element is gone
  this.fallbackFocusElement.focus();
});
```

## Key Points

- Service-based API similar to `MatDialog`
- Ideal for mobile action sheets
- Only one bottom sheet can be open at a time
- Pass data via `data` option, inject via `MAT_BOTTOM_SHEET_DATA`
- Focus is trapped and restored automatically
- Use `disableClose` carefully - affects accessibility

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/bottom-sheet/bottom-sheet.md
- https://material.angular.dev/components/bottom-sheet/overview
-->
