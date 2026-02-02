---
name: angular-aria-select
description: Single-selection dropdown pattern with keyboard navigation
---

# Select

A pattern combining readonly combobox with listbox for single-selection dropdowns.

## When to Use

Use Select when:
- Option list is fixed (fewer than 20 items)
- Options are familiar to users
- Forms need standard fields (country, status, category)
- Settings/configuration dropdowns

Avoid when:
- List has 20+ items → Use [Autocomplete](selection-autocomplete.md)
- Users need to search → Use [Autocomplete](selection-autocomplete.md)
- Multiple selection needed → Use [Multiselect](selection-multiselect.md)
- Very few options (2-3) → Use radio buttons instead

## Basic Usage

```html
<div ngCombobox readonly>
  <input ngComboboxInput readonly [value]="displayValue()" />
  
  <div popover cdkConnectedOverlay>
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

```typescript
@Component({...})
export class AppComponent {
  items = ['Apple', 'Banana', 'Cherry'];
  selected: string[] = [];
  
  displayValue = computed(() => this.selected[0] ?? 'Select an option');
}
```

## Select with Icons

```html
<div ngCombobox readonly>
  <input ngComboboxInput readonly [value]="displayValue()" />
  
  <div popover cdkConnectedOverlay>
    <ng-template ngComboboxPopupContainer>
      <ul ngListbox [(values)]="selected">
        @for (item of items; track item) {
          <li ngOption [value]="item.id">
            <span class="icon">{{ item.icon }}</span>
            {{ item.label }}
          </li>
        }
      </ul>
    </ng-template>
  </div>
</div>
```

## Disabled Select

```html
<div ngCombobox readonly [disabled]="true">
  <input ngComboboxInput readonly disabled [value]="displayValue()" />
  ...
</div>
```

## Combobox API (for Select)

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `readonly` | `boolean` | `false` | Set `true` for dropdown behavior |
| `disabled` | `boolean` | `false` | Disables the select |

## Listbox API (for Select)

### Model

| Property | Type | Description |
|----------|------|-------------|
| `values` | `any[]` | Two-way bindable, contains single value for select |

See [Listbox](selection-listbox.md) for complete API.

## Positioning

Use CDK Overlay for smart positioning:

```html
<div popover 
     cdkConnectedOverlay 
     [cdkConnectedOverlayOrigin]="trigger"
     [cdkConnectedOverlayOpen]="isOpen()">
```

Handles viewport edges and scrolling automatically.

## Key Points

- `readonly` attribute prevents text input, preserves keyboard navigation
- Arrow keys and Enter work like native select
- Single selection uses `values` array with one element
- Integrates with CDK Overlay for positioning

<!--
Source references:
- https://angular.dev/guide/aria/select
-->
