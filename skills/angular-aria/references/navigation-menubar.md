---
name: angular-aria-menubar
description: Horizontal navigation bar for persistent application menus
---

# Menubar

A horizontal navigation bar providing persistent access to application menus, organizing commands into categories like File, Edit, View.

## When to Use

Use Menubar when:
- Building application command bars (File, Edit, View, Format)
- Creating persistent navigation visible across the interface
- Organizing commands into logical top-level categories
- Need horizontal menu navigation with keyboard support
- Building desktop-style application interfaces

Avoid when:
- Building dropdown menus for individual actions → Use [Menu](navigation-menu.md)
- Creating context menus → Use Menu
- Simple standalone action lists → Use Menu
- Mobile interfaces with limited horizontal space
- Navigation belongs in sidebar or header pattern

## Basic Usage

```html
<nav ngMenuBar>
  <button ngMenuItem value="file" [submenu]="fileMenu">File</button>
  <button ngMenuItem value="edit" [submenu]="editMenu">Edit</button>
  <button ngMenuItem value="view" [submenu]="viewMenu">View</button>
</nav>

<div #fileMenu ngMenu>
  <button ngMenuItem value="new">New</button>
  <button ngMenuItem value="open">Open</button>
  <button ngMenuItem value="save">Save</button>
</div>

<div #editMenu ngMenu>
  <button ngMenuItem value="undo">Undo</button>
  <button ngMenuItem value="redo">Redo</button>
  <button ngMenuItem value="cut">Cut</button>
  <button ngMenuItem value="copy">Copy</button>
</div>

<div #viewMenu ngMenu>
  <button ngMenuItem value="zoom-in">Zoom In</button>
  <button ngMenuItem value="zoom-out">Zoom Out</button>
</div>
```

## Disabled Items

```html
<nav ngMenuBar [softDisabled]="true">
  <button ngMenuItem value="file" [submenu]="fileMenu">File</button>
  <button ngMenuItem value="edit" [disabled]="true" [submenu]="editMenu">Edit</button>
  <button ngMenuItem value="view" [submenu]="viewMenu">View</button>
</nav>
```

- `softDisabled="true"`: Disabled items focusable but not activatable
- `softDisabled="false"`: Disabled items skipped during navigation

## RTL Support

```html
<nav ngMenuBar dir="rtl">
  <button ngMenuItem value="file" [submenu]="fileMenu">ملف</button>
  <button ngMenuItem value="edit" [submenu]="editMenu">تحرير</button>
</nav>
```

Arrow key navigation automatically reverses for RTL.

## MenuBar API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disables entire menubar |
| `wrap` | `boolean` | `true` | Navigation wraps at edges |
| `softDisabled` | `boolean` | `true` | Disabled items focusable |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Left/Right Arrow | Navigate between top-level categories |
| Enter, Down Arrow | Open submenu, focus first item |
| Up/Down Arrow | Navigate within submenu |
| Escape | Close current menu |
| Home/End | Jump to first/last item |

## Menubar-specific Behaviors

- First keyboard interaction or click enables hover-to-open for submenus
- Left/Right arrows navigate between menubar items (vs Up/Down in vertical menus)
- `aria-haspopup="menu"` indicates items with submenus
- Persistent visibility (not modal/dismissable)

## Key Points

- Uses same MenuItem API as Menu
- Submenus open on hover after first keyboard/click interaction
- Handles nested submenu depths
- Automatic RTL support

<!--
Source references:
- https://angular.dev/guide/aria/menubar
-->
