---
name: angular-aria-autocomplete
description: Accessible autocomplete input with filtered suggestions
---

# Autocomplete

An accessible input field that filters and suggests options as users type.

## When to Use

Use autocomplete when:
- Option list is large (20+ items)
- Users know what they're looking for
- Options follow predictable patterns
- Speed of selection matters

Avoid when:
- List has fewer than 10 options (use dropdown)
- Users need to browse/discover options
- Options are unfamiliar to users

## Basic Usage

```html
<div ngCombobox filterMode="manual">
  <input ngComboboxInput [(value)]="searchText" placeholder="Search..." />
  
  <div popover>
    <ng-template ngComboboxPopupContainer>
      <ul ngListbox [(values)]="selected">
        @for (option of filteredOptions(); track option) {
          <li ngOption [value]="option">{{ option }}</li>
        }
      </ul>
    </ng-template>
  </div>
</div>
```

```typescript
@Component({...})
export class AppComponent {
  searchText = '';
  selected: string[] = [];
  
  options = ['Apple', 'Banana', 'Cherry', 'Date'];
  
  filteredOptions = computed(() => 
    this.options.filter(o => 
      o.toLowerCase().includes(this.searchText.toLowerCase())
    )
  );
}
```

## Filter Modes

### Auto-select Mode

Updates input to match first filtered option as users type:

```html
<div ngCombobox filterMode="auto-select" [firstMatch]="firstMatchingValue">
```

Best for: Quick selection when typing confirms intent.

### Manual Mode (Default)

Input stays unchanged until explicit selection:

```html
<div ngCombobox filterMode="manual">
```

Best for: Full control over filtering and selection.

### Highlight Mode

Highlights matching options without changing input:

```html
<div ngCombobox filterMode="highlight">
```

Best for: Browsing options while keeping search term intact.

## Combobox API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `filterMode` | `'auto-select' \| 'manual' \| 'highlight'` | `'manual'` | Selection behavior |
| `disabled` | `boolean` | `false` | Disables the combobox |
| `firstMatch` | `string` | - | First matching item for auto-select mode |

### Signals

| Property | Type | Description |
|----------|------|-------------|
| `expanded` | `Signal<boolean>` | Whether popup is open |

## ComboboxInput API

### Model

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Two-way bindable value `[(value)]` |

## Key Points

- Uses Popover API for optimal positioning
- Combines with `ngListbox` and `ngOption` for option list
- Keyboard: Arrow keys navigate, Enter selects, Escape closes
- Automatically handles RTL languages

<!--
Source references:
- https://angular.dev/guide/aria/autocomplete
- https://angular.dev/guide/aria/combobox
-->
