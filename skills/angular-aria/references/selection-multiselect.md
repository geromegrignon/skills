---
name: angular-aria-multiselect
description: Multiple-selection dropdown with compact display
---

# Multiselect

A pattern combining readonly combobox with multi-enabled listbox for multiple-selection dropdowns.

## When to Use

Use Multiselect when:
- Users need to select multiple related items
- Option list is fixed (fewer than 20 items)
- Filtering content with multiple criteria
- Assigning tags, labels, permissions
- Related choices that work together

Avoid when:
- Single selection needed → Use [Select](selection-select.md)
- List has 20+ items with search needed → Use [Autocomplete](selection-autocomplete.md)
- Most/all options will be selected → Use checklist pattern
- Independent binary options → Use individual checkboxes

## Basic Usage

```html
<div ngCombobox readonly>
  <input ngComboboxInput readonly [value]="displayValue()" />
  
  <div popover cdkConnectedOverlay>
    <ng-template ngComboboxPopupContainer>
      <ul ngListbox [multi]="true" [(values)]="selected">
        @for (item of items; track item) {
          <li ngOption [value]="item">
            <span class="checkmark" [class.visible]="isSelected(item)">✓</span>
            {{ item }}
          </li>
        }
      </ul>
    </ng-template>
  </div>
</div>
```

```typescript
@Component({...})
export class AppComponent {
  items = ['Red', 'Green', 'Blue', 'Yellow'];
  selected: string[] = [];
  
  displayValue = computed(() => {
    if (this.selected.length === 0) return 'Select options';
    if (this.selected.length === 1) return this.selected[0];
    return `${this.selected[0]} + ${this.selected.length - 1} more`;
  });
  
  isSelected(item: string) {
    return this.selected.includes(item);
  }
}
```

## Multiselect with Icons

```html
<ul ngListbox [multi]="true" [(values)]="selected">
  @for (item of items; track item.id) {
    <li ngOption [value]="item.id">
      <span class="checkmark" [class.visible]="isSelected(item.id)">✓</span>
      <span class="icon">{{ item.icon }}</span>
      {{ item.label }}
    </li>
  }
</ul>
```

## Controlled Selection (Limited)

Limit number of selections:

```typescript
@Component({...})
export class AppComponent {
  maxSelections = 3;
  selected: string[] = [];
  
  canSelect = computed(() => this.selected.length < this.maxSelections);
}
```

```html
<ul ngListbox [multi]="true" [(values)]="selected">
  @for (item of items; track item) {
    <li ngOption 
        [value]="item" 
        [disabled]="!canSelect() && !isSelected(item)">
      {{ item }}
    </li>
  }
</ul>
```

## Combobox API (for Multiselect)

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `readonly` | `boolean` | `false` | Set `true` for dropdown behavior |
| `disabled` | `boolean` | `false` | Disables the multiselect |

## Listbox API (for Multiselect)

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `multi` | `boolean` | `false` | Set `true` for multiple selection |

### Model

| Property | Type | Description |
|----------|------|-------------|
| `values` | `any[]` | Two-way bindable array of selected values |

## Key Points

- `multi` on listbox enables multiple selection
- Space toggles selection, popup stays open
- Show checkmarks for visual feedback on selected items
- Display value typically shows "Item + N more" pattern
- Uses CDK Overlay for positioning

<!--
Source references:
- https://angular.dev/guide/aria/multiselect
-->
