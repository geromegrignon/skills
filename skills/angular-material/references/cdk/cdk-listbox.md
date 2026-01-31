---
name: cdk-listbox
description: CDK directives for building accessible custom listbox controls
---

# CDK Listbox

## Imports

```ts
import { CdkListboxModule, CdkListbox, CdkOption } from '@angular/cdk/listbox';
```

Accessible listbox implementation following WAI ARIA patterns.

## Basic Setup

```html
<ul cdkListbox aria-label="Select a color">
  <li cdkOption="red">Red</li>
  <li cdkOption="green">Green</li>
  <li cdkOption="blue">Blue</li>
</ul>
```

## Value Binding

```html
<ul cdkListbox 
    [cdkListboxValue]="selectedColors"
    (cdkListboxValueChange)="onSelectionChange($event)">
  <li cdkOption="red">Red</li>
  <li cdkOption="green">Green</li>
</ul>
```

```ts
selectedColors: string[] = ['red'];

onSelectionChange(value: string[]): void {
  this.selectedColors = value;
}
```

**Note:** Value is always an array, even for single selection.

## Multiple Selection

```html
<ul cdkListbox cdkListboxMultiple aria-label="Select colors">
  <li cdkOption="red">Red</li>
  <li cdkOption="green">Green</li>
  <li cdkOption="blue">Blue</li>
</ul>
```

## Forms Integration

### Template-Driven

```html
<ul cdkListbox [(ngModel)]="selectedValue">
  <li cdkOption="a">Option A</li>
  <li cdkOption="b">Option B</li>
</ul>
```

### Reactive Forms

```html
<ul cdkListbox [formControl]="selectionControl">
  <li cdkOption="a">Option A</li>
  <li cdkOption="b">Option B</li>
</ul>
```

## Disabled States

### Disabled Listbox

```html
<ul cdkListbox cdkListboxDisabled>
  <li cdkOption="a">Option A</li>
</ul>
```

### Disabled Options

```html
<ul cdkListbox>
  <li cdkOption="a">Available</li>
  <li cdkOption="b" cdkOptionDisabled>Unavailable</li>
</ul>
```

## Compare Function

For object values:

```html
<ul cdkListbox [cdkListboxCompareWith]="compareUsers">
  @for (user of users; track user.id) {
    <li [cdkOption]="user">{{user.name}}</li>
  }
</ul>
```

```ts
users = [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}];

compareUsers(u1: User, u2: User): boolean {
  return u1?.id === u2?.id;
}
```

## Orientation

```html
<!-- Vertical (default) -->
<ul cdkListbox cdkListboxOrientation="vertical">

<!-- Horizontal -->
<ul cdkListbox cdkListboxOrientation="horizontal">
```

## Focus Strategies

### Roving Tabindex (Default)

Focus moves between options:

```html
<ul cdkListbox>...</ul>
```

### Active Descendant

Focus stays on listbox, active option tracked via ARIA:

```html
<ul cdkListbox [useActiveDescendant]="true">...</ul>
```

## Navigation Options

### Disable Wrap

Prevent wrap from end to start:

```html
<ul cdkListbox cdkListboxNavigationWrapDisabled>
```

### Navigate Disabled Options

Allow navigating to disabled options:

```html
<ul cdkListbox cdkListboxNavigatesDisabledOptions>
```

## Typeahead

Default uses option text content. Custom typeahead label:

```html
<li cdkOption="🍎" cdkOptionTypeaheadLabel="apple">🍎 Apple</li>
<li cdkOption="🍊" cdkOptionTypeaheadLabel="orange">🍊 Orange</li>
```

## CSS Classes

| Directive | Class | When |
|-----------|-------|------|
| `cdkListbox` | `.cdk-listbox` | Always |
| `cdkOption` | `.cdk-option` | Always |
| `cdkOption` | `.cdk-option-active` | When active |

## ARIA Attributes

Automatically managed:

| Directive | Attribute | Applied |
|-----------|-----------|---------|
| `cdkListbox` | `aria-multiselectable` | Based on mode |
| `cdkListbox` | `aria-orientation` | Based on orientation |
| `cdkListbox` | `aria-disabled` | When disabled |
| `cdkOption` | `aria-selected` | Based on selection |
| `cdkOption` | `aria-disabled` | When disabled |

## Keyboard Interaction

| Key | Action |
|-----|--------|
| `↓` | Next option (vertical) |
| `↑` | Previous option (vertical) |
| `→` | Next option (horizontal) |
| `←` | Previous option (horizontal) |
| `Home` | First option |
| `End` | Last option |
| `Space` | Select focused option |
| `Shift + ↓/↑` | Extend selection (multiple) |
| `Ctrl + A` | Select all (multiple) |
| Type characters | Typeahead navigation |

## Complete Example

```html
<div class="listbox-container">
  <label id="colors-label">Favorite Colors</label>
  <ul cdkListbox 
      cdkListboxMultiple
      aria-labelledby="colors-label"
      [cdkListboxValue]="selectedColors"
      (cdkListboxValueChange)="selectedColors = $event">
    @for (color of colors; track color.value) {
      <li [cdkOption]="color.value" 
          [cdkOptionDisabled]="color.disabled">
        <span class="color-swatch" [style.background]="color.value"></span>
        {{color.name}}
      </li>
    }
  </ul>
</div>
```

```scss
.cdk-listbox {
  list-style: none;
  padding: 0;
  border: 1px solid #ccc;
}

.cdk-option {
  padding: 8px 12px;
  cursor: pointer;
  
  &.cdk-option-active {
    background: #e3f2fd;
  }
  
  &[aria-selected="true"] {
    background: #bbdefb;
  }
  
  &[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

## Key Points

- `cdkListbox` for container, `cdkOption` for items
- Value is always an array (even single selection)
- Works with template-driven and reactive forms
- `cdkListboxMultiple` enables multi-select
- `cdkListboxCompareWith` for object comparison
- Automatic ARIA role and attribute management
- Full keyboard navigation support
- No styling included - fully customizable

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/listbox/listbox.md
- https://material.angular.dev/cdk/listbox/overview
-->
