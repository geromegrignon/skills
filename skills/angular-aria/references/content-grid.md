---
name: angular-aria-grid
description: Two-dimensional data display with cell-by-cell keyboard navigation
---

# Grid

Enables users to navigate two-dimensional data or interactive elements using directional arrow keys, Home, End, and Page Up/Down.

## When to Use

Use Grid when:
- Building interactive data tables with editable/selectable cells
- Creating calendars or date pickers
- Implementing spreadsheet-like interfaces
- Grouping interactive elements to reduce tab stops
- Interfaces requiring two-dimensional keyboard navigation

Avoid when:
- Displaying simple read-only tables → Use semantic HTML `<table>`
- Showing single-column lists → Use [Listbox](selection-listbox.md)
- Displaying hierarchical data → Use [Tree](content-tree.md)
- Building forms without tabular layout

## Basic Data Table

```html
<table ngGrid>
  <thead>
    <tr ngGridRow>
      <th ngGridCell role="columnheader">Name</th>
      <th ngGridCell role="columnheader">Email</th>
      <th ngGridCell role="columnheader">Status</th>
    </tr>
  </thead>
  <tbody>
    @for (user of users; track user.id) {
      <tr ngGridRow>
        <td ngGridCell>{{ user.name }}</td>
        <td ngGridCell>{{ user.email }}</td>
        <td ngGridCell>{{ user.status }}</td>
      </tr>
    }
  </tbody>
</table>
```

## Calendar Grid

```html
<table ngGrid aria-label="February 2026">
  <thead>
    <tr ngGridRow>
      @for (day of weekdays; track day) {
        <th ngGridCell role="columnheader">{{ day }}</th>
      }
    </tr>
  </thead>
  <tbody>
    @for (week of weeks; track $index) {
      <tr ngGridRow>
        @for (date of week; track date) {
          <td ngGridCell 
              [attr.aria-selected]="isSelected(date)"
              (click)="selectDate(date)">
            {{ date?.getDate() }}
          </td>
        }
      </tr>
    }
  </tbody>
</table>
```

## Layout Grid (Pill Buttons)

```html
<div ngGrid role="grid">
  <div ngGridRow>
    @for (item of row1Items; track item) {
      <button ngGridCell>{{ item }}</button>
    }
  </div>
  <div ngGridRow>
    @for (item of row2Items; track item) {
      <button ngGridCell>{{ item }}</button>
    }
  </div>
</div>
```

Reduces tab stops - users navigate with arrow keys.

## Selection

```html
<table ngGrid 
       [enableSelection]="true" 
       [selectionMode]="'explicit'"
       [multi]="true">
  ...
</table>
```

### Selection Modes

| Mode | Behavior |
|------|----------|
| `'follow'` | Focused cell automatically selected |
| `'explicit'` | Users select with Space or click |

### Focus Modes

| Mode | Behavior |
|------|----------|
| `'roving'` | Focus moves to cells using tabindex |
| `'activedescendant'` | Focus stays on container, aria-activedescendant indicates active |

## Wrapping Behavior

```html
<table ngGrid [rowWrap]="'continuous'" [colWrap]="'loop'">
```

| Value | Behavior |
|-------|----------|
| `'continuous'` | Wraps to next/prev row/column |
| `'loop'` | Wraps within current row/column |
| `'nowrap'` | Stops at edges |

## Grid API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enableSelection` | `boolean` | `false` | Enable selection |
| `disabled` | `boolean` | `false` | Disables grid |
| `softDisabled` | `boolean` | `true` | Disabled cells focusable |
| `focusMode` | `'roving' \| 'activedescendant'` | `'roving'` | Focus strategy |
| `rowWrap` | `'continuous' \| 'loop' \| 'nowrap'` | `'loop'` | Row wrapping |
| `colWrap` | `'continuous' \| 'loop' \| 'nowrap'` | `'loop'` | Column wrapping |
| `multi` | `boolean` | `false` | Multiple selection |
| `selectionMode` | `'follow' \| 'explicit'` | `'follow'` | Selection behavior |
| `enableRangeSelection` | `boolean` | `false` | Range selection |

## GridRow API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rowIndex` | `number` | auto | Row index in grid |

## GridCell API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | auto | Unique identifier |
| `role` | `string` | `'gridcell'` | Cell role (`gridcell`, `columnheader`, `rowheader`) |
| `disabled` | `boolean` | `false` | Disables cell |
| `selected` | `boolean` | `false` | Selection state (two-way) |
| `selectable` | `boolean` | `true` | Whether cell can be selected |
| `rowSpan` | `number` | - | Rows spanned |
| `colSpan` | `number` | - | Columns spanned |
| `rowIndex` | `number` | - | Row index |
| `colIndex` | `number` | - | Column index |

### Signals

| Property | Type | Description |
|----------|------|-------------|
| `active` | `Signal<boolean>` | Whether cell has focus |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Arrow keys | Move between cells |
| Home/End | First/last cell in row |
| Ctrl+Home/End | First/last cell in grid |
| Page Up/Down | Move by page |
| Space | Select cell (explicit mode) |
| Enter | Activate cell |

## Key Points

- Apply `ngGrid` to table/container, `ngGridRow` to rows, `ngGridCell` to cells
- Use role="columnheader" or "rowheader" for header cells
- Roving tabindex is simpler; activedescendant better for virtual scrolling
- Supports RTL navigation automatically

<!--
Source references:
- https://angular.dev/guide/aria/grid
-->
