---
name: component-autocomplete
description: Text input with dropdown suggestions and filtering
---

# Autocomplete

## Imports

```ts
import { MatAutocompleteModule, MAT_AUTOCOMPLETE_DEFAULT_OPTIONS } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// For autocomplete events
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
```

Text input enhanced with a panel of suggested options.

## Basic Setup

```html
<mat-form-field>
  <mat-label>State</mat-label>
  <input matInput [matAutocomplete]="auto" [formControl]="stateControl">
  <mat-autocomplete #auto="matAutocomplete">
    @for (state of states; track state) {
      <mat-option [value]="state">{{state}}</mat-option>
    }
  </mat-autocomplete>
</mat-form-field>
```

## Filtering Options

```ts
states = ['Alabama', 'Alaska', 'Arizona', ...];
stateControl = new FormControl('');

filteredStates$ = this.stateControl.valueChanges.pipe(
  startWith(''),
  map(value => this.filterStates(value || ''))
);

filterStates(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.states.filter(state => 
    state.toLowerCase().includes(filterValue)
  );
}
```

```html
<mat-autocomplete #auto="matAutocomplete">
  @for (state of filteredStates$ | async; track state) {
    <mat-option [value]="state">{{state}}</mat-option>
  }
</mat-autocomplete>
```

## Display vs Value

When values are objects:

```ts
users = [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}];

displayFn(user: User): string {
  return user?.name || '';
}
```

```html
<mat-autocomplete #auto [displayWith]="displayFn">
  @for (user of filteredUsers; track user.id) {
    <mat-option [value]="user">{{user.name}}</mat-option>
  }
</mat-autocomplete>
```

## Require Selection

Reset if user doesn't select from options:

```html
<mat-autocomplete #auto requireSelection>
```

Behavior:
- If opened, changed, but nothing selected → value resets to `null`
- If opened and closed without changes → old value preserved

Global configuration:

```ts
providers: [
  {
    provide: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS,
    useValue: {requireSelection: true}
  }
]
```

## Auto-Highlight First Option

```html
<mat-autocomplete #auto autoActiveFirstOption>
```

## Option Groups

```html
<mat-autocomplete #auto>
  <mat-optgroup label="Fruits">
    <mat-option value="apple">Apple</mat-option>
    <mat-option value="banana">Banana</mat-option>
  </mat-optgroup>
  <mat-optgroup label="Vegetables">
    <mat-option value="carrot">Carrot</mat-option>
  </mat-optgroup>
</mat-autocomplete>
```

## Custom Input Element

Use without `mat-form-field`:

```html
<input [matAutocomplete]="auto" class="custom-input">
<mat-autocomplete #auto>...</mat-autocomplete>
```

## Attach to Different Element

```html
<div class="wrapper" matAutocompleteOrigin #origin="matAutocompleteOrigin">
  <input [matAutocomplete]="auto" [matAutocompleteConnectedTo]="origin">
</div>
<mat-autocomplete #auto>...</mat-autocomplete>
```

## Panel Styling

```html
<mat-autocomplete #auto class="custom-panel" panelWidth="400px">
```

```scss
.custom-panel {
  max-height: 300px;
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↓` / `↑` | Navigate options |
| `Enter` | Select active option |
| `Escape` | Close panel |
| `Alt + ↓` | Open panel |
| `Alt + ↑` | Close panel |

## Events

```ts
<mat-autocomplete #auto 
    (opened)="onOpened()"
    (closed)="onClosed()"
    (optionSelected)="onSelected($event)">
```

```ts
onSelected(event: MatAutocompleteSelectedEvent): void {
  console.log('Selected:', event.option.value);
}
```

## With Chips (Tag Input)

Combine with `mat-chip-grid`:

```html
<mat-form-field>
  <mat-chip-grid #chipGrid>
    @for (item of selectedItems; track item) {
      <mat-chip-row (removed)="remove(item)">
        {{item}}
        <button matChipRemove><mat-icon>cancel</mat-icon></button>
      </mat-chip-row>
    }
  </mat-chip-grid>
  <input [matChipInputFor]="chipGrid" 
         [matAutocomplete]="auto"
         (matChipInputTokenEnd)="add($event)">
  <mat-autocomplete #auto (optionSelected)="selected($event)">
    @for (option of filteredOptions; track option) {
      <mat-option [value]="option">{{option}}</mat-option>
    }
  </mat-autocomplete>
</mat-form-field>
```

## Accessibility

- Uses combobox ARIA pattern
- Input has `role="combobox"`, panel has `role="listbox"`
- Don't nest interactive controls in options
- Provide label via `<mat-label>` or `aria-label`
- Preserves focus on input, uses `aria-activedescendant`

## Key Points

- Filter options using `valueChanges` observable
- Use `displayWith` for object values
- `requireSelection` enforces picking from suggestions
- `autoActiveFirstOption` highlights first match
- Works with chips for tag-style input
- Panel opens on focus or `Alt + ↓`

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/autocomplete/autocomplete.md
- https://material.angular.dev/components/autocomplete/overview
-->
