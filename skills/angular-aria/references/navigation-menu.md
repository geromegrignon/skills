---
name: angular-aria-menu
description: Dropdown menus with nested submenus and keyboard shortcuts
---

# Menu

A menu offers a list of actions or options, supporting keyboard navigation, submenus, checkboxes, radio buttons, and disabled items.

## When to Use

Use Menu when:
- Building application command menus (File, Edit, View)
- Creating context menus (right-click actions)
- Showing dropdown action lists
- Implementing toolbar dropdowns
- Organizing settings or options

Avoid when:
- Building site navigation → Use navigation landmarks
- Creating form selects → Use [Select](selection-select.md)
- Switching content panels → Use [Tabs](content-tabs.md)
- Showing collapsible content → Use [Accordion](content-accordion.md)

## Menu with Trigger

```html
<button [ngMenuTrigger]="menu">Options</button>

<div #menu ngMenu>
  <button ngMenuItem value="edit">Edit</button>
  <button ngMenuItem value="copy">Copy</button>
  <button ngMenuItem value="delete">Delete</button>
</div>
```

## Context Menu

```html
<div (contextmenu)="showContextMenu($event)">
  Right-click here
</div>

<div #contextMenu ngMenu [style.left.px]="menuX" [style.top.px]="menuY">
  <button ngMenuItem value="cut">Cut</button>
  <button ngMenuItem value="copy">Copy</button>
  <button ngMenuItem value="paste">Paste</button>
</div>
```

```typescript
showContextMenu(event: MouseEvent) {
  event.preventDefault();
  this.menuX = event.clientX;
  this.menuY = event.clientY;
  this.contextMenu.open();
}
```

## Standalone Menu

Always visible, not triggered by button:

```html
<div ngMenu>
  <button ngMenuItem value="option1">Option 1</button>
  <button ngMenuItem value="option2">Option 2</button>
</div>
```

## Submenus

```html
<div ngMenu>
  <button ngMenuItem value="new">New</button>
  <button ngMenuItem value="open" [submenu]="openRecent">Open Recent</button>
  <button ngMenuItem value="save">Save</button>
</div>

<div #openRecent ngMenu>
  <button ngMenuItem value="file1">Document 1</button>
  <button ngMenuItem value="file2">Document 2</button>
</div>
```

## Disabled Items

```html
<div ngMenu [softDisabled]="true">
  <button ngMenuItem value="edit">Edit</button>
  <button ngMenuItem value="delete" [disabled]="true">Delete</button>
</div>
```

- `softDisabled="true"`: Disabled items focusable but not activatable
- `softDisabled="false"`: Disabled items skipped during navigation

## Menu API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disables all items |
| `wrap` | `boolean` | `true` | Navigation wraps at edges |
| `softDisabled` | `boolean` | `true` | Disabled items focusable |

### Methods

| Method | Description |
|--------|-------------|
| `close()` | Closes the menu |
| `focusFirstItem()` | Focuses first menu item |

## MenuItem API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `any` | - | Value (required) |
| `disabled` | `boolean` | `false` | Disables this item |
| `submenu` | `Menu` | - | Reference to submenu |
| `searchTerm` | `string` | `''` | Term for typeahead |

### Signals

| Property | Type | Description |
|----------|------|-------------|
| `active` | `Signal<boolean>` | Whether item has focus |
| `expanded` | `Signal<boolean>` | Whether submenu is expanded |
| `hasPopup` | `Signal<boolean>` | Whether has submenu |

## MenuTrigger API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `menu` | `Menu` | - | Menu to trigger (required) |
| `disabled` | `boolean` | `false` | Disables trigger |
| `softDisabled` | `boolean` | `true` | Disabled trigger focusable |

### Signals

| Property | Type | Description |
|----------|------|-------------|
| `expanded` | `Signal<boolean>` | Whether menu is open |

### Methods

| Method | Description |
|--------|-------------|
| `open()` | Opens menu |
| `close()` | Closes menu |
| `toggle()` | Toggles menu |

## Key Points

- Arrow keys navigate, Enter activates, Escape closes
- Type characters to jump to matching items
- Auto-closes when item selected or focus moves away
- Supports RTL languages automatically

<!--
Source references:
- https://angular.dev/guide/aria/menu
-->
