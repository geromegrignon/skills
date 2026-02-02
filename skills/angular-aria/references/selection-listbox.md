---
name: angular-aria-listbox
description: Single or multi-select option lists with keyboard navigation
---

# Listbox

Displays a list of selectable options with keyboard navigation, single or multiple selection, and screen reader support.

## When to Use

Use Listbox as a building block for:
- Custom selection components
- Visible selection lists on the page (not dropdowns)
- Custom integration patterns

For dropdowns, use the composed patterns instead:
- [Select](selection-select.md) - Single-selection dropdown
- [Multiselect](selection-multiselect.md) - Multiple-selection dropdown
- [Autocomplete](selection-autocomplete.md) - Filterable dropdown

Avoid Listbox when:
- Building navigation menus → Use Menu directive

## Basic Usage

```html
<ul ngListbox [(values)]="selected">
  @for (item of items; track item) {
    <li ngOption [value]="item">{{ item }}</li>
  }
</ul>
```

```typescript
@Component({...})
export class AppComponent {
  items = ['Option 1', 'Option 2', 'Option 3'];
  selected: string[] = [];
}
```

## Horizontal Listbox

For toolbar-like or tab-style selections:

```html
<ul ngListbox orientation="horizontal" [(values)]="selected">
  @for (item of items; track item) {
    <li ngOption [value]="item">{{ item }}</li>
  }
</ul>
```

Left/Right arrow keys navigate instead of Up/Down. RTL languages automatically reverse navigation.

## Selection Modes

### Follow Mode (Default)

Automatically selects focused item:

```html
<ul ngListbox selectionMode="follow" [(values)]="selected">
```

Best for: Fast interaction when selection changes frequently.

### Explicit Mode

Requires Space or Enter to confirm selection:

```html
<ul ngListbox selectionMode="explicit" [(values)]="selected">
```

Best for: Preventing accidental changes while navigating.

## Multi-Selection

Enable multiple selections:

```html
<ul ngListbox [multi]="true" [(values)]="selected">
```

## Listbox API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | auto | Unique identifier |
| `multi` | `boolean` | `false` | Enables multiple selection |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction |
| `wrap` | `boolean` | `true` | Whether focus wraps at edges |
| `selectionMode` | `'follow' \| 'explicit'` | `'follow'` | How selection is triggered |
| `focusMode` | `'roving' \| 'activedescendant'` | `'roving'` | Focus management strategy |
| `softDisabled` | `boolean` | `true` | Whether disabled items are focusable |
| `disabled` | `boolean` | `false` | Disables entire listbox |
| `readonly` | `boolean` | `false` | Makes listbox readonly |
| `typeaheadDelay` | `number` | `500` | Ms before type-ahead resets |

### Model

| Property | Type | Description |
|----------|------|-------------|
| `values` | `V[]` | Two-way bindable array `[(values)]` |

### Methods

| Method | Description |
|--------|-------------|
| `scrollActiveItemIntoView(options?)` | Scrolls active item into view |
| `gotoFirst()` | Navigates to first item |

## Option API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | auto | Unique identifier |
| `value` | `V` | - | Value (required) |
| `label` | `string` | - | Optional label for screen readers |
| `disabled` | `boolean` | `false` | Whether option is disabled |

### Signals

| Property | Type | Description |
|----------|------|-------------|
| `selected` | `Signal<boolean>` | Whether option is selected |
| `active` | `Signal<boolean>` | Whether option has focus |

## Key Points

- Type characters to jump to matching options (type-ahead)
- Arrow keys navigate, Space/Enter select in explicit mode
- Used by Select, Multiselect, and Autocomplete patterns
- `softDisabled` controls whether disabled items receive focus

<!--
Source references:
- https://angular.dev/guide/aria/listbox
-->
