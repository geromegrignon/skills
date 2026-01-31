---
name: component-snackbar
description: Brief notifications and messages via snackbar service
---

# Snackbar

## Imports

```ts
import { 
  MatSnackBarModule, 
  MatSnackBar, 
  MatSnackBarRef, 
  MAT_SNACK_BAR_DATA,
  MAT_SNACK_BAR_DEFAULT_OPTIONS 
} from '@angular/material/snack-bar';
```

`MatSnackBar` displays brief messages at the bottom of the screen.

## Basic Usage

```ts
import {MatSnackBar} from '@angular/material/snack-bar';

snackBar = inject(MatSnackBar);

showMessage(): void {
  this.snackBar.open('Message archived');
}
```

## With Action

```ts
const snackBarRef = this.snackBar.open('Message archived', 'Undo');

snackBarRef.onAction().subscribe(() => {
  this.undoArchive();
});
```

## Duration

Auto-dismiss after specified milliseconds:

```ts
this.snackBar.open('Saved successfully', 'OK', {
  duration: 3000
});
```

## Custom Component

```ts
this.snackBar.openFromComponent(CustomSnackbarComponent, {
  data: {message: 'Custom content', type: 'success'}
});
```

### Component Template

```ts
@Component({
  template: `
    <span matSnackBarLabel>{{data.message}}</span>
    <span matSnackBarActions>
      <button mat-button matSnackBarAction (click)="dismiss()">Dismiss</button>
    </span>
  `
})
export class CustomSnackbar {
  snackBarRef = inject<MatSnackBarRef<CustomSnackbar>>(MatSnackBarRef);
  data = inject(MAT_SNACK_BAR_DATA);

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
```

### Content Directives

| Directive | Purpose |
|-----------|---------|
| `matSnackBarLabel` | Main message text |
| `matSnackBarActions` | Action buttons container |
| `matSnackBarAction` | Individual action button |

## Configuration Options

```ts
this.snackBar.open('Message', 'Action', {
  duration: 5000,
  horizontalPosition: 'center',  // 'start' | 'center' | 'end' | 'left' | 'right'
  verticalPosition: 'bottom',    // 'top' | 'bottom'
  panelClass: ['custom-snackbar'],
  politeness: 'polite',          // 'polite' | 'assertive' | 'off'
});
```

## Snackbar Reference

```ts
const snackBarRef = this.snackBar.open('Message', 'Action');

// Dismiss programmatically
snackBarRef.dismiss();

// Listen for dismissal
snackBarRef.afterDismissed().subscribe(info => {
  if (info.dismissedByAction) {
    console.log('User clicked action');
  }
});

// Listen for open
snackBarRef.afterOpened().subscribe(() => {
  console.log('Snackbar opened');
});

// Listen for action click
snackBarRef.onAction().subscribe(() => {
  console.log('Action clicked');
});
```

## Global Defaults

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2500,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    }
  ]
};
```

## Queueing Behavior

Only one snackbar displays at a time. New snackbars automatically dismiss existing ones.

```ts
// First snackbar
this.snackBar.open('First message');

// Second immediately dismisses first
this.snackBar.open('Second message');
```

## Accessibility

- Uses `aria-live` region for announcements
- Default politeness is `polite` (waits for current speech)
- Use `assertive` for urgent messages
- Avoid duration for snackbars with actions (users need time)
- Provide alternative ways to perform snackbar actions

```ts
// Urgent notification
this.snackBar.open('Connection lost!', 'Retry', {
  politeness: 'assertive'
});
```

## Custom Styling

```ts
this.snackBar.open('Error occurred', 'Dismiss', {
  panelClass: ['error-snackbar']
});
```

```scss
.error-snackbar {
  --mdc-snackbar-container-color: var(--mat-sys-error-container);
  --mdc-snackbar-supporting-text-color: var(--mat-sys-on-error-container);
}
```

## Key Points

- Service-based API (`MatSnackBar.open()`)
- Only one snackbar visible at a time
- Use `duration` for auto-dismiss
- Avoid duration when actions are present
- Custom components use `MAT_SNACK_BAR_DATA` for data
- `onAction()` observable for action button clicks
- `afterDismissed()` tells you how it was dismissed

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/snack-bar/snack-bar.md
- https://material.angular.dev/components/snack-bar/overview
-->
