---
name: component-input
description: Native input and textarea integration with mat-form-field
---

# Input

## Imports

```ts
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TextFieldModule } from '@angular/cdk/text-field'; // For cdkTextareaAutosize

// Optional: Error state customization
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
```

The `matInput` directive enhances native `<input>` and `<textarea>` elements.

## Basic Usage

```html
<mat-form-field>
  <mat-label>Email</mat-label>
  <input matInput type="email" [(ngModel)]="email">
</mat-form-field>

<mat-form-field>
  <mat-label>Message</mat-label>
  <textarea matInput [(ngModel)]="message"></textarea>
</mat-form-field>
```

## Supported Input Types

- `color`, `date`, `datetime-local`, `email`
- `month`, `number`, `password`, `search`
- `tel`, `text`, `time`, `url`, `week`

## With Reactive Forms

```html
<mat-form-field>
  <mat-label>Username</mat-label>
  <input matInput [formControl]="usernameControl">
  @if (usernameControl.hasError('required')) {
    <mat-error>Username is required</mat-error>
  }
</mat-form-field>
```

## Placeholder

```html
<mat-form-field>
  <mat-label>Phone</mat-label>
  <input matInput placeholder="(555) 555-5555">
</mat-form-field>
```

## Hints and Errors

```html
<mat-form-field>
  <mat-label>Password</mat-label>
  <input matInput type="password" [formControl]="passwordControl">
  <mat-hint>At least 8 characters</mat-hint>
  @if (passwordControl.hasError('minlength')) {
    <mat-error>Password too short</mat-error>
  }
</mat-form-field>
```

## Prefix and Suffix

```html
<mat-form-field>
  <mat-label>Amount</mat-label>
  <span matTextPrefix>$</span>
  <input matInput type="number">
  <span matTextSuffix>.00</span>
</mat-form-field>

<mat-form-field>
  <mat-label>Search</mat-label>
  <input matInput>
  <mat-icon matSuffix>search</mat-icon>
</mat-form-field>
```

## Auto-Resizing Textarea

Using CDK's `cdkTextareaAutosize`:

```html
<mat-form-field>
  <mat-label>Description</mat-label>
  <textarea matInput
            cdkTextareaAutosize
            cdkAutosizeMinRows="2"
            cdkAutosizeMaxRows="10">
  </textarea>
</mat-form-field>
```

## Error State Matching

Customize when errors appear:

```ts
class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    return control && control.invalid && control.dirty;
  }
}
```

```html
<input matInput [formControl]="emailControl" [errorStateMatcher]="matcher">
```

Global configuration:

```ts
providers: [
  {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
]
```

## Readonly and Disabled

```html
<mat-form-field>
  <input matInput value="Readonly text" readonly>
</mat-form-field>

<mat-form-field>
  <input matInput value="Disabled" disabled>
</mat-form-field>
```

## Native Select in Form Field

```html
<mat-form-field>
  <mat-label>Country</mat-label>
  <select matNativeControl [(ngModel)]="country">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
    <option value="uk">United Kingdom</option>
  </select>
</mat-form-field>
```

## Autofill Detection

Using CDK's `AutofillMonitor`:

```ts
autofillMonitor = inject(AutofillMonitor);

constructor() {
  afterNextRender(() => {
    this.autofillMonitor.monitor(this.emailInput).subscribe(event => {
      if (event.isAutofilled) {
        console.log('Email was autofilled');
      }
    });
  });
}

ngOnDestroy() {
  this.autofillMonitor.stopMonitoring(this.emailInput);
}

```

Or use directive:

```html
<input matInput (cdkAutofill)="onAutofill($event)">
```

## Clearing Input

```html
<mat-form-field>
  <mat-label>Search</mat-label>
  <input matInput [(ngModel)]="searchText">
  @if (searchText) {
    <button matSuffix mat-icon-button (click)="searchText = ''">
      <mat-icon>close</mat-icon>
    </button>
  }
</mat-form-field>
```

## Accessibility

- `<mat-label>` automatically sets `aria-label`
- `<mat-error>` and `<mat-hint>` added to `aria-describedby`
- `aria-invalid` updated based on validation state

```html
<!-- Without mat-label, provide aria-label -->
<mat-form-field>
  <input matInput aria-label="Email address" placeholder="Email">
</mat-form-field>
```

## Key Points

- `matInput` works with native `<input>` and `<textarea>`
- Use inside `<mat-form-field>` for labels, hints, errors
- `matNativeControl` for native `<select>` elements
- `cdkTextareaAutosize` for auto-growing textarea
- Custom `ErrorStateMatcher` controls error display timing
- Errors, hints automatically connected via ARIA

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/input/input.md
- https://material.angular.dev/components/input/overview
-->
