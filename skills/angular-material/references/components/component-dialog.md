---
name: component-dialog
description: Material Design modal dialogs with data sharing, focus management, and animations
---

# MatDialog

## Imports

```ts
import { 
  MatDialogModule, 
  MatDialog, 
  MatDialogRef, 
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS 
} from '@angular/material/dialog';
```

The `MatDialog` service creates modal dialogs with Material Design styling and animations.

## Basic Usage

```ts
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({...})
export class App {
  dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(UserProfileComponent, {
      width: '600px',
      height: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
    });
  }
}
```

## Dialog Component

```ts
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  template: `
    <h2 mat-dialog-title>User Profile</h2>
    <mat-dialog-content>
      <p>Name: {{data.name}}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="true">Save</button>
    </mat-dialog-actions>
  `
})
export class UserProfileComponent {
  dialogRef = inject(MatDialogRef<UserProfileComponent>);
  data = inject(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close('result value');
  }
}
```

## Passing Data

```ts
const dialogRef = this.dialog.open(MyDialogComponent, {
  data: {
    name: 'John',
    id: 123
  }
});
```

Access in dialog:

```ts
data = inject(MAT_DIALOG_DATA);
```

For template dialogs:

```html
<ng-template let-data>
  Hello, {{data.name}}
</ng-template>
```

## Dialog Directives

| Directive | Description |
|-----------|-------------|
| `mat-dialog-title` | Dialog title (apply to heading element) |
| `<mat-dialog-content>` | Scrollable content area |
| `<mat-dialog-actions>` | Action buttons container |
| `mat-dialog-close` | Closes dialog, optionally with result value |

### Actions Alignment

```html
<mat-dialog-actions align="end">  <!-- or "center" -->
  <button mat-button mat-dialog-close>Cancel</button>
  <button mat-button [mat-dialog-close]="formData">Submit</button>
</mat-dialog-actions>
```

## Configuration Options

```ts
const dialogRef = this.dialog.open(MyComponent, {
  width: '500px',
  height: '400px',
  maxWidth: '90vw',
  maxHeight: '90vh',
  panelClass: 'custom-dialog-container',
  hasBackdrop: true,
  backdropClass: 'custom-backdrop',
  disableClose: false,          // Prevent ESC and backdrop click close
  autoFocus: 'first-tabbable',  // Focus strategy
  restoreFocus: true,           // Restore focus on close
  data: {...},
});
```

## Global Defaults

```ts
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        disableClose: false,
        width: '400px'
      }
    }
  ]
};
```

## Animation Control

```ts
const dialogRef = this.dialog.open(MyComponent, {
  enterAnimationDuration: '300ms',
  exitAnimationDuration: '200ms',
});

// Disable animations
const dialogRef = this.dialog.open(MyComponent, {
  enterAnimationDuration: '0ms',
  exitAnimationDuration: '0ms',
});
```

## Focus Management

### Auto Focus Options

| Value | Behavior |
|-------|----------|
| `'first-tabbable'` | Focus first tabbable element (default) |
| `'first-header'` | Focus first heading (`h1`-`h6`) |
| `'dialog'` | Focus the dialog container |
| CSS selector | Focus element matching selector |

```ts
this.dialog.open(MyComponent, {
  autoFocus: '.confirm-button'  // Focus specific element
});
```

### Tab Index Control

```html
<button mat-button tabindex="-1">Not Tabbable</button>
```

### Focus Restoration

Handle when original element is gone (e.g., opened from menu):

```ts
openDialogFromMenu(): void {
  const dialogRef = this.dialog.open(MyComponent);
  
  dialogRef.afterClosed().subscribe(() => {
    // Menu item is gone, focus alternative
    this.menuTrigger().focus();
  });
}
```

## Accessibility

```ts
this.dialog.open(MyComponent, {
  role: 'alertdialog',           // Default: 'dialog'
  ariaLabel: 'Confirm deletion',
  ariaLabelledBy: 'dialog-title',
  ariaDescribedBy: 'dialog-description',
});
```

## Dialog Reference API

```ts
const dialogRef = this.dialog.open(MyComponent);

// Close with result
dialogRef.close('success');

// Observables
dialogRef.afterClosed().subscribe(result => {...});
dialogRef.afterOpened().subscribe(() => {...});
dialogRef.beforeClosed().subscribe(result => {...});
dialogRef.backdropClick().subscribe(() => {...});
dialogRef.keydownEvents().subscribe(event => {...});

// Update config
dialogRef.updateSize('600px', '400px');
dialogRef.updatePosition({top: '50px', left: '100px'});
```

## Close All Dialogs

```ts
this.dialog.closeAll();
```

## Key Points

- Dialog components can inject `MatDialogRef` to control their own dialog
- Use `MAT_DIALOG_DATA` to access passed data
- `mat-dialog-close` directive provides declarative close with result
- Focus is automatically trapped inside the dialog
- ESC key closes by default (disable with `disableClose: true`)
- All notification observables complete when dialog closes
- Handle focus restoration when trigger element may not exist

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/dialog/dialog.md
- https://material.angular.dev/components/dialog/overview
-->
