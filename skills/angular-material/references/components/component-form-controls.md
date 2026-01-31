---
name: component-form-controls
description: Checkbox, radio buttons, slide toggle, and slider
---

# Form Controls

## Imports

```ts
import { MatCheckboxModule, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
```

Basic form control components for selection and value input.

## Checkbox

```html
<mat-checkbox [(ngModel)]="isChecked">Remember me</mat-checkbox>

<mat-checkbox [formControl]="agreeControl">I agree to terms</mat-checkbox>
```

### Indeterminate State

```html
<mat-checkbox [indeterminate]="isIndeterminate">
  Select All
</mat-checkbox>
```

### Label Position

```html
<mat-checkbox labelPosition="before">Label before</mat-checkbox>
<mat-checkbox labelPosition="after">Label after (default)</mat-checkbox>
```

### Click Behavior

```ts
// Global configuration
providers: [
  {
    provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
    useValue: {clickAction: 'check-indeterminate'}
  }
]
```

| Value | Behavior |
|-------|----------|
| `check-indeterminate` | Default - toggle checked, clear indeterminate |
| `check` | Toggle checked, preserve indeterminate |
| `noop` | No automatic changes, handle manually |

---

## Radio Buttons

```html
<mat-radio-group [(ngModel)]="selectedOption">
  <mat-radio-button value="option1">Option 1</mat-radio-button>
  <mat-radio-button value="option2">Option 2</mat-radio-button>
  <mat-radio-button value="option3">Option 3</mat-radio-button>
</mat-radio-group>
```

### With Reactive Forms

```html
<mat-radio-group [formControl]="colorControl">
  <mat-radio-button value="red">Red</mat-radio-button>
  <mat-radio-button value="green">Green</mat-radio-button>
  <mat-radio-button value="blue">Blue</mat-radio-button>
</mat-radio-group>
```

### Label Position

```html
<mat-radio-group>
  <mat-radio-button value="a" labelPosition="before">Before</mat-radio-button>
  <mat-radio-button value="b" labelPosition="after">After</mat-radio-button>
</mat-radio-group>
```

---

## Slide Toggle

On/off switch control:

```html
<mat-slide-toggle [(ngModel)]="isEnabled">Enable notifications</mat-slide-toggle>
```

### With Reactive Forms

```html
<mat-slide-toggle [formControl]="darkModeControl">Dark Mode</mat-slide-toggle>
```

### Disabled State

```html
<mat-slide-toggle disabled>Cannot toggle</mat-slide-toggle>
```

---

## Slider

Value selection from a range:

```html
<mat-slider min="0" max="100">
  <input matSliderThumb [(ngModel)]="volume">
</mat-slider>
```

### With Steps

```html
<mat-slider min="0" max="100" step="10">
  <input matSliderThumb>
</mat-slider>
```

### Discrete (Show Value)

```html
<mat-slider discrete min="0" max="100">
  <input matSliderThumb>
</mat-slider>
```

### Tick Marks

```html
<mat-slider showTickMarks min="0" max="100" step="10">
  <input matSliderThumb>
</mat-slider>
```

### Range Slider

```html
<mat-slider min="0" max="100">
  <input matSliderStartThumb [(ngModel)]="minValue">
  <input matSliderEndThumb [(ngModel)]="maxValue">
</mat-slider>
```

### Custom Label Format

```ts
formatLabel(value: number): string {
  return `${value}%`;
}
```

```html
<mat-slider discrete [displayWith]="formatLabel">
  <input matSliderThumb>
</mat-slider>
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `↑` | Increment by step |
| `←` / `↓` | Decrement by step |
| `Page Up` | Increment by 10% |
| `Page Down` | Decrement by 10% |
| `Home` | Set to minimum |
| `End` | Set to maximum |

---

## Accessibility

### Checkbox

```html
<mat-checkbox [aria-label]="getCheckboxLabel()" />
```

### Radio

```html
<mat-radio-group aria-label="Select your favorite color">
  <mat-radio-button value="red">Red</mat-radio-button>
</mat-radio-group>
```

### Slide Toggle

```html
<mat-slide-toggle [aria-label]="getToggleLabel()" />
```

### Slider

```html
<mat-slider aria-label="Volume control">
  <input matSliderThumb>
</mat-slider>
```

## Key Points

- All controls work with `FormsModule` and `ReactiveFormsModule`
- Checkbox supports indeterminate state
- Radio buttons should be in a `mat-radio-group`
- Slide toggle is similar to checkbox but no indeterminate
- Slider requires `<input matSliderThumb>` inside
- Range slider uses `matSliderStartThumb` and `matSliderEndThumb`
- Always provide accessible labels

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/checkbox/checkbox.md
- https://github.com/angular/components/blob/main/src/material/radio/radio.md
- https://github.com/angular/components/blob/main/src/material/slide-toggle/slide-toggle.md
- https://github.com/angular/components/blob/main/src/material/slider/slider.md
-->
