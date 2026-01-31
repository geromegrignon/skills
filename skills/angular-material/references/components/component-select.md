---
name: component-select
description: Material Design select dropdown with single and multiple selection
---

# Select

## Imports

```ts
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

// Optional: Error state customization
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
```

`<mat-select>` provides a dropdown for selecting from a list of options.

## Basic Usage

```html
<mat-form-field>
  <mat-label>Favorite food</mat-label>
  <mat-select [(value)]="selectedFood">
    <mat-option value="pizza">Pizza</mat-option>
    <mat-option value="pasta">Pasta</mat-option>
    <mat-option value="tacos">Tacos</mat-option>
  </mat-select>
</mat-form-field>
```

## Native Select Alternative

For better accessibility and performance:

```html
<mat-form-field>
  <mat-label>Country</mat-label>
  <select matNativeControl [(ngModel)]="country">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
  </select>
</mat-form-field>
```

## Forms Integration

### Reactive Forms

```html
<mat-form-field>
  <mat-label>Team</mat-label>
  <mat-select [formControl]="teamControl">
    @for (team of teams; track team.id) {
    <mat-option [value]="team.id">
      {{team.name}}
    </mat-option>
    }
  </mat-select>
</mat-form-field>
```

### Compare With Function

For object comparison:

```ts
compareTeams(t1: Team, t2: Team): boolean {
  return t1 && t2 ? t1.id === t2.id : t1 === t2;
}
```

```html
<mat-select [compareWith]="compareTeams" [formControl]="teamControl">
```

## Multiple Selection

```html
<mat-form-field>
  <mat-label>Toppings</mat-label>
  <mat-select multiple [(value)]="toppings">
    <mat-option value="cheese">Cheese</mat-option>
    <mat-option value="pepperoni">Pepperoni</mat-option>
    <mat-option value="mushrooms">Mushrooms</mat-option>
  </mat-select>
</mat-form-field>
```

Value is a sorted array: `['cheese', 'mushrooms']`

## Option Groups

```html
<mat-select>
  <mat-optgroup label="Fruits">
    <mat-option value="apple">Apple</mat-option>
    <mat-option value="banana">Banana</mat-option>
  </mat-optgroup>
  <mat-optgroup label="Vegetables" [disabled]="true">
    <mat-option value="carrot">Carrot</mat-option>
  </mat-optgroup>
</mat-select>
```

## Custom Trigger Label

```html
<mat-select [formControl]="toppingsControl" multiple>
  <mat-select-trigger>
    {{toppingsControl.value?.length || 0}} toppings selected
  </mat-select-trigger>
  @for (topping of toppings; track topping) {
  <mat-option [value]="topping">
    {{topping}}
  </mat-option>
</mat-select>
```

## Reset Option

Omit value to create a reset option:

```html
<mat-select [(value)]="selectedOption">
  <mat-option>None</mat-option>
  <mat-option value="option1">Option 1</mat-option>
  <mat-option value="option2">Option 2</mat-option>
</mat-select>
```

## Nullable Options

Allow selecting `null`/`undefined` as values:

```html
<mat-select [canSelectNullableOptions]="true">
  <mat-option [value]="null">No preference</mat-option>
  <mat-option value="yes">Yes</mat-option>
  <mat-option value="no">No</mat-option>
</mat-select>
```

## Disabling

```html
<!-- Disable entire select -->
<mat-select disabled>...</mat-select>

<!-- Disable specific option -->
<mat-option value="unavailable" disabled>Unavailable</mat-option>
```

## Panel Styling

```html
<mat-select panelClass="custom-select-panel">
```

```scss
.custom-select-panel {
  max-height: 300px;
}
```

## Error State Matching

Custom error display timing:

```ts
class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    return control?.invalid && control?.dirty;
  }
}
```

```html
<mat-select [errorStateMatcher]="matcher">
```

Global configuration:

```ts
providers: [
  {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
]
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↓` / `↑` | Navigate options |
| `Enter` | Open/select |
| `Escape` | Close panel |
| `Alt + ↓` | Open panel |
| `Alt + ↑` | Close panel |

## Accessibility

- Prefer native `<select>` for widest platform support
- Always provide `<mat-label>` or `aria-label`
- Don't nest interactive controls in options
- Keep checkmark indicator for visual identification

## Common Errors

### Cannot change `multiple` mode after initialization

Use conditional rendering:

```html
@if (isMultiple()) {
  <mat-select multiple>...</mat-select>
} @else {
  <mat-select>...</mat-select>
}
```

### Value must be an array in multiple-selection mode

```ts
// Wrong
mySelect.value = 'option1';

// Correct
mySelect.value = ['option1'];
```

## Key Points

- Use inside `<mat-form-field>` for labels, hints, errors
- Native `<select>` has better accessibility for simple cases
- `compareWith` required for object value comparison
- Multiple selection returns sorted array
- Option groups organize related options
- Disable ripple with `disableRipple` input

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/select/select.md
- https://material.angular.dev/components/select/overview
-->
