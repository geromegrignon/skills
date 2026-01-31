---
name: component-form-field
description: Material Design form field wrapper with labels, hints, errors, and decorations
---

# MatFormField

## Imports

```ts
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // For matInput directive
```

`<mat-form-field>` wraps form controls to apply Material Design styling including floating labels, underlines, hints, and error messages.

## Supported Controls

- `<input matInput>` / `<textarea matInput>`
- `<select matNativeControl>`
- `<mat-select>`
- `<mat-chip-grid>`
- Custom form field controls

## Basic Usage

```html
<mat-form-field>
  <mat-label>Email</mat-label>
  <input matInput type="email" [(ngModel)]="email">
</mat-form-field>
```

## Appearance Variants

### Fill (Default)

```html
<mat-form-field appearance="fill">
  <mat-label>Name</mat-label>
  <input matInput>
</mat-form-field>
```

### Outline

```html
<mat-form-field appearance="outline">
  <mat-label>Name</mat-label>
  <input matInput>
</mat-form-field>
```

### Global Default

```ts
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline'
      }
    }
  ]
};
```

## Floating Label

```html
<!-- Default: auto (floats when focused or has value) -->
<mat-form-field>
  <mat-label>Name</mat-label>
  <input matInput>
</mat-form-field>

<!-- Always float -->
<mat-form-field floatLabel="always">
  <mat-label>Name</mat-label>
  <input matInput>
</mat-form-field>
```

### Required Indicator

Required fields show an asterisk automatically:

```html
<mat-form-field>
  <mat-label>Name</mat-label>
  <input matInput required>
</mat-form-field>

<!-- Hide required marker -->
<mat-form-field [hideRequiredMarker]="true">
  <mat-label>Name</mat-label>
  <input matInput required>
</mat-form-field>
```

## Hints

```html
<!-- Single hint via attribute -->
<mat-form-field hintLabel="Max 100 characters">
  <mat-label>Description</mat-label>
  <textarea matInput></textarea>
</mat-form-field>

<!-- Multiple hints with alignment -->
<mat-form-field>
  <mat-label>Email</mat-label>
  <input matInput #email>
  <mat-hint align="start">Enter your email</mat-hint>
  <mat-hint align="end">{{email.value.length}} / 50</mat-hint>
</mat-form-field>
```

## Error Messages

Errors display when control is invalid and touched:

```html
<mat-form-field>
  <mat-label>Email</mat-label>
  <input matInput [formControl]="emailControl">
  @if (emailControl.hasError('required')) {
    <mat-error>Email is required</mat-error>
  }
  @if (emailControl.hasError('email')) {
    <mat-error>Invalid email format</mat-error>
  }
</mat-form-field>
```

```ts
emailControl = new FormControl('', [Validators.required, Validators.email]);
```

## Prefix & Suffix

### Icons

```html
<mat-form-field>
  <mat-label>Search</mat-label>
  <mat-icon matPrefix>search</mat-icon>
  <input matInput>
  <mat-icon matSuffix>close</mat-icon>
</mat-form-field>
```

### Text

```html
<mat-form-field>
  <mat-label>Price</mat-label>
  <span matTextPrefix>$</span>
  <input matInput type="number">
  <span matTextSuffix>.00</span>
</mat-form-field>
```

### Buttons

```html
<mat-form-field>
  <mat-label>Password</mat-label>
  <input matInput [type]="showPassword ? 'text' : 'password'">
  <button mat-icon-button matSuffix (click)="showPassword = !showPassword">
    <mat-icon>{{showPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
  </button>
</mat-form-field>
```

## Theming

Apply color variants via Sass:

```scss
@use '@angular/material' as mat;

// In your theme file
@include mat.form-field-theme($theme, $color-variant: 'secondary');
```

Available variants: `'primary'`, `'secondary'`, `'tertiary'`, `'error'`

## Global Configuration

```ts
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        floatLabel: 'always',
        hideRequiredMarker: false
      }
    }
  ]
};
```

## Accessibility

- `<mat-label>` automatically creates a native `<label>` with `for` attribute
- `<mat-hint>` and `<mat-error>` are added to `aria-describedby`
- `<mat-error>` uses `aria-live="polite"` for announcements
- Without `<mat-label>`, provide `aria-label` or `aria-labelledby` manually

## Common Errors

### "mat-form-field must contain a MatFormFieldControl"

The form field has no supported control:

```html
<!-- Wrong: missing matInput -->
<mat-form-field>
  <input type="text">
</mat-form-field>

<!-- Correct -->
<mat-form-field>
  <input matInput type="text">
</mat-form-field>
```

### "A hint was already declared for align='...'"

Two hints with same alignment:

```html
<!-- Wrong -->
<mat-form-field hintLabel="Hint 1">
  <mat-hint>Hint 2</mat-hint>  <!-- Both default to start -->
</mat-form-field>

<!-- Correct -->
<mat-form-field>
  <mat-hint align="start">Hint 1</mat-hint>
  <mat-hint align="end">Hint 2</mat-hint>
</mat-form-field>
```

## Key Points

- `mat-form-field` provides consistent styling for form controls
- Use `matInput` directive on native inputs/textareas
- `appearance`: `'fill'` (default) or `'outline'`
- Hints and errors occupy the same space; errors hide hints
- Use `matPrefix`/`matSuffix` for icons, `matTextPrefix`/`matTextSuffix` for text
- Multiple errors can exist but only one space is reserved by default

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/form-field/form-field.md
- https://material.angular.dev/components/form-field/overview
-->
