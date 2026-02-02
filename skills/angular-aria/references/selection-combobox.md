---
name: angular-aria-combobox
description: Primitive directive coordinating text input with popup
---

# Combobox

A primitive directive that coordinates a text input with a popup, providing the foundation for autocomplete, select, and multiselect patterns.

## When to Use Directly

Use combobox directly when:
- Building custom autocomplete patterns with specialized filtering
- Creating custom selection components with unique requirements
- Coordinating input with listbox, tree, or dialog content
- Implementing specific filter modes

For standard patterns, use the documented higher-level patterns:
- Autocomplete with filtering → [Autocomplete](selection-autocomplete.md)
- Single-selection dropdown → [Select](selection-select.md)
- Multiple-selection dropdown → [Multiselect](selection-multiselect.md)

## Basic Usage

```html
<div ngCombobox filterMode="manual">
  <input ngComboboxInput [(value)]="inputValue" />
  
  <div popover>
    <ng-template ngComboboxPopupContainer>
      <ul ngListbox [(values)]="selected">
        @for (item of items; track item) {
          <li ngOption [value]="item">{{ item }}</li>
        }
      </ul>
    </ng-template>
  </div>
</div>
```

## Readonly Mode (Select Pattern)

For dropdown-style selects without text input:

```html
<div ngCombobox readonly>
  <input ngComboboxInput readonly [value]="displayValue" />
  
  <div popover>
    <ng-template ngComboboxPopupContainer>
      <ul ngListbox [(values)]="selected">
        @for (item of items; track item) {
          <li ngOption [value]="item">{{ item }}</li>
        }
      </ul>
    </ng-template>
  </div>
</div>
```

## Dialog Popup

For modal popup behavior with backdrop and focus trap:

```html
<div ngCombobox>
  <input ngComboboxInput [(value)]="inputValue" />
  
  <dialog ngComboboxDialog>
    <ul ngListbox [(values)]="selected">
      @for (item of items; track item) {
        <li ngOption [value]="item">{{ item }}</li>
      }
    </ul>
  </dialog>
</div>
```

## Combobox API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `filterMode` | `'manual' \| 'auto-select' \| 'highlight'` | `'manual'` | Selection behavior |
| `disabled` | `boolean` | `false` | Disables the combobox |
| `readonly` | `boolean` | `false` | Makes readonly for Select/Multiselect |
| `firstMatch` | `V` | - | Value of first matching item for auto-select |
| `alwaysExpanded` | `boolean` | `false` | Keeps popup always open |

### Filter Modes

| Mode | Behavior |
|------|----------|
| `'manual'` | User controls filtering/selection explicitly |
| `'auto-select'` | Input auto-updates to first matching option |
| `'highlight'` | Highlights matching text without changing input |

### Signals

| Property | Type | Description |
|----------|------|-------------|
| `expanded` | `Signal<boolean>` | Whether popup is open |

### Methods

| Method | Description |
|--------|-------------|
| `open()` | Opens the combobox |
| `close()` | Closes the combobox |
| `expand()` | Expands the combobox |
| `collapse()` | Collapses the combobox |

## ComboboxInput API

### Model

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Two-way bindable value `[(value)]` |

## ComboboxPopupContainer

Marks an `ng-template` as the popup content:

```html
<ng-template ngComboboxPopupContainer>
  <div ngListbox>...</div>
</ng-template>
```

## ComboboxDialog

Creates a modal combobox popup:

```html
<dialog ngComboboxDialog>
  <div ngListbox>...</div>
</dialog>
```

## Key Points

- Foundation for Autocomplete, Select, and Multiselect patterns
- Typically combines with Listbox for option lists
- Can also combine with Tree for hierarchical popup content
- Handles keyboard navigation, ARIA attributes automatically

<!--
Source references:
- https://angular.dev/guide/aria/combobox
-->
