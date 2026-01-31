---
name: component-chips
description: Chips for selection, filtering, and tag-style input
---

# Chips

## Imports

```ts
import { MatChipsModule, MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

// For chip input events and separator keys
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

// For autocomplete integration (import BEFORE MatChipsModule)
import { MatAutocompleteModule } from '@angular/material/autocomplete';
```

Compact elements for information display, selection, and text entry.

## Chip Variants

| Container | Chip | Use Case |
|-----------|------|----------|
| `mat-chip-set` | `mat-chip` | Static display |
| `mat-chip-listbox` | `mat-chip-option` | Selection (single/multi) |
| `mat-chip-grid` | `mat-chip-row` | Text input with tags |

## Static Chips (Display Only)

```html
<mat-chip-set>
  <mat-chip>Apple</mat-chip>
  <mat-chip>Banana</mat-chip>
  <mat-chip disabled>Orange</mat-chip>
</mat-chip-set>
```

## Selection Chips

### Single Selection

```html
<mat-chip-listbox aria-label="Color selection">
  <mat-chip-option value="red">Red</mat-chip-option>
  <mat-chip-option value="green">Green</mat-chip-option>
  <mat-chip-option value="blue" selected>Blue</mat-chip-option>
</mat-chip-listbox>
```

### Multiple Selection

```html
<mat-chip-listbox multiple aria-label="Toppings">
  <mat-chip-option>Cheese</mat-chip-option>
  <mat-chip-option>Pepperoni</mat-chip-option>
  <mat-chip-option>Mushrooms</mat-chip-option>
</mat-chip-listbox>
```

### Forms Integration

```html
<mat-chip-listbox [(ngModel)]="selectedColors" multiple>
  <mat-chip-option value="red">Red</mat-chip-option>
  <mat-chip-option value="green">Green</mat-chip-option>
</mat-chip-listbox>
```

## Input Chips (Tag Entry)

```html
<mat-form-field>
  <mat-label>Tags</mat-label>
  <mat-chip-grid #chipGrid aria-label="Enter tags">
    @for (tag of tags; track tag) {
      <mat-chip-row (removed)="removeTag(tag)">
        {{tag}}
        <button matChipRemove aria-label="Remove {{tag}}">
          <mat-icon>cancel</mat-icon>
        </button>
      </mat-chip-row>
    }
  </mat-chip-grid>
  <input [matChipInputFor]="chipGrid"
         [matChipInputSeparatorKeyCodes]="separatorKeyCodes"
         (matChipInputTokenEnd)="addTag($event)">
</mat-form-field>
```

```ts
import {COMMA, ENTER} from '@angular/cdk/keycodes';

tags = signal<string[]>(['Angular', 'Material']);
separatorKeyCodes = [ENTER, COMMA];

addTag(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();
  if (value) {
    this.tags.update(tags => [...tags, value]);
  }
  event.chipInput.clear();
}

removeTag(tag: string): void {
  const index = this.tags().indexOf(tag);
  if (index >= 0) {
    this.tags.update(tags => tags.filter((_, i) => i !== index));
  }
}
```

## With Autocomplete

```html
<mat-form-field>
  <mat-chip-grid #chipGrid>
    @for (fruit of fruits; track fruit) {
      <mat-chip-row (removed)="remove(fruit)">
        {{fruit}}
        <button matChipRemove><mat-icon>cancel</mat-icon></button>
      </mat-chip-row>
    }
  </mat-chip-grid>
  <input #fruitInput
         [matChipInputFor]="chipGrid"
         [matAutocomplete]="auto"
         (matChipInputTokenEnd)="add($event)">
  <mat-autocomplete #auto (optionSelected)="selected($event)">
    @for (fruit of filteredFruits; track fruit) {
      <mat-option [value]="fruit">{{fruit}}</mat-option>
    }
  </mat-autocomplete>
</mat-form-field>
```

**Important:** Import `MatAutocompleteModule` before `MatChipsModule` for correct keyboard behavior.

## Chip Icons

### Avatar (Front)

```html
<mat-chip>
  <img matChipAvatar src="avatar.jpg" alt="User">
  John Doe
</mat-chip>
```

### Trailing Icon

```html
<mat-chip>
  Settings
  <mat-icon matChipTrailingIcon>settings</mat-icon>
</mat-chip>
```

### Remove Button

```html
<mat-chip-option>
  Tag Name
  <button matChipRemove aria-label="Remove tag">
    <mat-icon>cancel</mat-icon>
  </button>
</mat-chip-option>
```

## Stacked Layout

Vertical chip display:

```html
<mat-chip-set class="mat-mdc-chip-set-stacked">
  <mat-chip>Chip 1</mat-chip>
  <mat-chip>Chip 2</mat-chip>
</mat-chip-set>
```

## Editable Chips

```html
<mat-chip-row [editable]="true" (edited)="onEdit($event)">
  {{value}}
</mat-chip-row>
```

## Global Configuration

```ts
providers: [
  {
    provide: MAT_CHIPS_DEFAULT_OPTIONS,
    useValue: {
      separatorKeyCodes: [COMMA, SPACE]
    }
  }
]
```

## Keyboard Interaction

**Listbox (`mat-chip-listbox`):**
- Arrow keys: Navigate chips
- Space: Select/deselect

**Grid (`mat-chip-grid`):**
- Arrow keys: Navigate chips
- Delete/Backspace: Remove chip (triggers `removed`)

## Accessibility

- Always add `aria-label` to `mat-chip-grid` and `mat-chip-listbox`
- Use `<button>` for `matChipRemove`, not `<mat-icon>`
- Don't nest interactive controls in `mat-chip-option`
- Add `aria-description` for editable chips with editing instructions
- Keep selection indicator visible for accessibility

## Key Points

- Three chip patterns: display, selection, input
- `mat-chip-listbox` for selection (forms compatible)
- `mat-chip-grid` for text entry with tag display
- `matChipRemove` handles removal interaction
- Works seamlessly with autocomplete
- Separator keys configurable globally or per-input

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/chips/chips.md
- https://material.angular.dev/components/chips/overview
-->
