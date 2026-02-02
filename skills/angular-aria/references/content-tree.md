---
name: angular-aria-tree
description: Hierarchical lists with expand/collapse functionality
---

# Tree

Displays hierarchical data where items can expand to reveal children or collapse to hide them. Users navigate with arrow keys and optionally select items.

## When to Use

Use Tree when:
- Building file system navigation
- Showing folder/document hierarchies
- Creating nested menu structures
- Displaying organization charts
- Browsing hierarchical data
- Site navigation with nested sections

Avoid when:
- Displaying flat lists → Use [Listbox](selection-listbox.md)
- Showing data tables → Use [Grid](content-grid.md)
- Creating simple dropdowns → Use [Select](selection-select.md)
- Building breadcrumb navigation

## Basic Usage

```html
<ul ngTree [(values)]="selected">
  <li ngTreeItem value="folder1">
    Folder 1
    <ul ngTreeGroup>
      <li ngTreeItem value="file1">File 1</li>
      <li ngTreeItem value="file2">File 2</li>
    </ul>
  </li>
  <li ngTreeItem value="folder2">
    Folder 2
    <ul ngTreeGroup>
      <li ngTreeItem value="file3">File 3</li>
    </ul>
  </li>
</ul>
```

## Navigation Tree

For navigation where clicking triggers actions rather than selecting:

```html
<ul ngTree [nav]="true">
  <li ngTreeItem value="home">Home</li>
  <li ngTreeItem value="docs">
    Documentation
    <ul ngTreeGroup>
      <li ngTreeItem value="getting-started">Getting Started</li>
      <li ngTreeItem value="api">API Reference</li>
    </ul>
  </li>
</ul>
```

Uses `aria-current` to indicate current page.

## Single Selection (Default)

```html
<ul ngTree [(values)]="selected">
  ...
</ul>
```

Space selects the focused item.

## Multi-Selection

```html
<ul ngTree [multi]="true" [(values)]="selected">
  ...
</ul>
```

Space toggles selection. Shift+Arrow keys for range selection.

## Selection Follows Focus

```html
<ul ngTree selectionMode="follow" [(values)]="selected">
  ...
</ul>
```

Selection automatically updates as user navigates.

## Disabled Items

```html
<ul ngTree [softDisabled]="true" [(values)]="selected">
  <li ngTreeItem value="enabled">Enabled</li>
  <li ngTreeItem value="disabled" [disabled]="true">Disabled</li>
</ul>
```

- `softDisabled="true"`: Disabled items focusable but not selectable
- `softDisabled="false"`: Disabled items skipped during navigation

## Programmatic Control

```html
<ul #tree ngTree [(values)]="selected">
  ...
</ul>

<button (click)="tree.expandAll()">Expand All</button>
<button (click)="tree.collapseAll()">Collapse All</button>
```

## Tree API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disables entire tree |
| `softDisabled` | `boolean` | `true` | Disabled items focusable |
| `multi` | `boolean` | `false` | Multiple selection |
| `selectionMode` | `'explicit' \| 'follow'` | `'explicit'` | Selection behavior |
| `nav` | `boolean` | `false` | Navigation mode (aria-current) |
| `wrap` | `boolean` | `true` | Navigation wraps at edges |
| `focusMode` | `'roving' \| 'activedescendant'` | `'roving'` | Focus strategy |
| `values` | `any[]` | `[]` | Selected values (two-way) |

### Methods

| Method | Description |
|--------|-------------|
| `expandAll()` | Expands all nodes |
| `collapseAll()` | Collapses all nodes |
| `selectAll()` | Selects all (multi mode) |
| `clearSelection()` | Clears selection |

## TreeItem API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `any` | - | Unique value (required) |
| `disabled` | `boolean` | `false` | Disables item |
| `expanded` | `boolean` | `false` | Expanded state (two-way) |

### Signals

| Property | Type | Description |
|----------|------|-------------|
| `selected` | `Signal<boolean>` | Whether selected |
| `active` | `Signal<boolean>` | Whether has focus |
| `hasChildren` | `Signal<boolean>` | Whether has child nodes |

### Methods

| Method | Description |
|--------|-------------|
| `expand()` | Expands node |
| `collapse()` | Collapses node |
| `toggle()` | Toggles expansion |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Up/Down | Navigate between visible items |
| Right | Expand parent or move to first child |
| Left | Collapse parent or move to parent |
| Enter | Activate item |
| Space | Select item (in explicit mode) |
| Home/End | Jump to first/last item |

## Key Points

- `ngTreeGroup` wraps child items
- Right arrow expands, Left arrow collapses
- Type characters for type-ahead search
- Supports RTL languages automatically

<!--
Source references:
- https://angular.dev/guide/aria/tree
-->
