---
name: cdk-dialog
description: Unstyled modal dialog service for building custom dialog implementations
---

# CDK Dialog

## Imports

```ts
import { DialogModule, Dialog, DialogRef, DIALOG_DATA, DialogConfig, DEFAULT_DIALOG_CONFIG } from '@angular/cdk/dialog';
import { CdkDialogContainer } from '@angular/cdk/dialog';
```

Unstyled modal dialog foundation for building custom dialog services.

## Setup

Include overlay styles:

```scss
// Option 1: Import prebuilt CSS
@import '@angular/cdk/overlay-prebuilt.css';

// Option 2: Use Sass mixin
@use '@angular/cdk' as cdk;
@include cdk.overlay();
```

## Opening a Dialog

```ts
import { Dialog } from '@angular/cdk/dialog';

@Component({...})
export class App {
  dialog = inject(Dialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(MyDialogComponent, {
      width: '400px',
      height: '300px',
      panelClass: 'my-dialog-panel'
    });

    dialogRef.closed.subscribe(result => {
      console.log('Dialog closed with:', result);
    });
  }
}
```

## Using TemplateRef

```ts
@Component({
  template: `
    <ng-template #dialogTemplate let-data let-dialogRef="dialogRef">
      <h2>Hello, {{ data.name }}</h2>
      <button (click)="dialogRef.close('confirmed')">Close</button>
    </ng-template>
  `
})
export class App {
  dialogTemplate = viewChild.required<TemplateRef<any>>(TemplateRef);

  openDialog(): void {
    this.dialog.open(this.dialogTemplate, {
      data: { name: 'World' }
    });
  }
}
```

## Dialog Component

```ts
import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'my-dialog',
  template: `
    <h2>{{ data.title }}</h2>
    <p>{{ data.message }}</p>
    <button (click)="close()">Cancel</button>
    <button (click)="confirm()">Confirm</button>
  `,
  styles: [`
    :host {
      display: block;
      background: white;
      padding: 24px;
      border-radius: 8px;
    }
  `]
})
export class MyDialog {
  dialogRef = inject(DialogRef<string>);
  data = inject(DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.dialogRef.close('confirmed');
  }
}
```

## Configuration Options

```ts
this.dialog.open(MyDialogComponent, {
  // Dimensions
  width: '400px',
  height: '300px',
  minWidth: '200px',
  maxWidth: '80vw',
  minHeight: '100px',
  maxHeight: '90vh',

  // Data
  data: { key: 'value' },

  // Behavior
  disableClose: false,        // Disable ESC and backdrop click
  hasBackdrop: true,
  backdropClass: 'my-backdrop',
  panelClass: 'my-panel',

  // ARIA
  role: 'dialog',             // or 'alertdialog'
  ariaLabel: 'Dialog title',
  ariaLabelledBy: 'title-id',
  ariaDescribedBy: 'desc-id',

  // Focus
  autoFocus: 'first-tabbable', // or 'first-header', 'dialog', CSS selector
  restoreFocus: true,          // or false, CSS selector, HTMLElement

  // Position
  positionStrategy: this.overlay.position()
    .global()
    .centerHorizontally()
    .centerVertically()
});
```

## DialogRef API

```ts
const dialogRef = this.dialog.open(MyDialogComponent);

// Close the dialog with optional result
dialogRef.close('result');

// Observables
dialogRef.closed.subscribe(result => {});
dialogRef.backdropClick.subscribe(() => {});
dialogRef.keydownEvents.subscribe(event => {});

// Update configuration
dialogRef.updateSize('500px', '400px');
dialogRef.updatePosition();
```

## Custom Container

```ts
import { CdkDialogContainer } from '@angular/cdk/dialog';

@Component({
  selector: 'my-dialog-container',
  template: `
    <div class="dialog-header">
      <ng-content select="[dialog-title]"></ng-content>
    </div>
    <div class="dialog-body">
      <ng-template cdkPortalOutlet></ng-template>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }
  `]
})
export class MyDialogContainer extends CdkDialogContainer {}

// Use custom container
this.dialog.open(MyDialogComponent, {
  container: MyDialogContainer
});
```

## Global Defaults

```ts
import { DEFAULT_DIALOG_CONFIG, DialogConfig } from '@angular/cdk/dialog';

const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: DEFAULT_DIALOG_CONFIG,
      useValue: {
        hasBackdrop: true,
        disableClose: false,
        width: '400px',
        panelClass: 'app-dialog'
      } as DialogConfig
    }
  ]
};
```

## Focus Management

Auto-focus options:

| Value | Behavior |
|-------|----------|
| `'first-tabbable'` | First tabbable element (default) |
| `'first-header'` | First `h1`-`h6` or `role="heading"` |
| `'dialog'` | The dialog container itself |
| CSS selector | First matching element |

## Focus Restoration

```ts
this.dialog.open(MyDialogComponent, {
  // Boolean: restore to previously focused element
  restoreFocus: true,
  
  // String: CSS selector
  restoreFocus: '#my-button',
  
  // Element reference
  restoreFocus: this.myButton.nativeElement
});
```

## Styling

```scss
// Global styles for panel class
.my-dialog-panel {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

// Backdrop
.my-backdrop {
  background: rgba(0, 0, 0, 0.5);
}
```

## Key Points

- Unstyled foundation for custom dialogs
- `Dialog` service opens dialogs, returns `DialogRef`
- `DIALOG_DATA` injection token for passing data
- Supports component or TemplateRef content
- Focus trapping and restoration built-in
- `CdkDialogContainer` base for custom containers
- `DEFAULT_DIALOG_CONFIG` for global defaults
- Full keyboard and ARIA support

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/dialog/dialog.md
- https://material.angular.dev/cdk/dialog/overview
-->
