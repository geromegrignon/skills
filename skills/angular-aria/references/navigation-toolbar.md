---
name: angular-aria-toolbar
description: Grouped sets of controls with logical keyboard navigation
---

# Toolbar

A container for grouping related controls with keyboard navigation, commonly used for text formatting, toolbars, and command panels.

## When to Use

Use Toolbar when:
- Multiple related actions (like text formatting buttons)
- Keyboard efficiency matters (arrow key navigation)
- Grouped controls with separators
- Frequent access within a workflow

Avoid when:
- Simple button group (2-3 unrelated actions)
- Controls aren't related
- Complex nested navigation → Use menus instead

## Basic Horizontal Toolbar

```html
<div ngToolbar aria-label="Formatting">
  <button ngToolbarWidget value="bold">Bold</button>
  <button ngToolbarWidget value="italic">Italic</button>
  <button ngToolbarWidget value="underline">Underline</button>
</div>
```

Arrow keys navigate between widgets. Tab moves out of toolbar.

## Vertical Toolbar

```html
<div ngToolbar orientation="vertical" aria-label="Tools">
  <button ngToolbarWidget value="select">Select</button>
  <button ngToolbarWidget value="brush">Brush</button>
  <button ngToolbarWidget value="eraser">Eraser</button>
</div>
```

Up/Down arrows navigate in vertical orientation.

## Widget Groups (Radio/Toggle)

### Single Selection (Radio Group)

```html
<div ngToolbar>
  <div ngToolbarWidgetGroup role="radiogroup" aria-label="Alignment">
    <button ngToolbarWidget value="left">Left</button>
    <button ngToolbarWidget value="center">Center</button>
    <button ngToolbarWidget value="right">Right</button>
  </div>
</div>
```

### Multiple Selection (Toggle Group)

```html
<div ngToolbar>
  <div ngToolbarWidgetGroup [multi]="true" aria-label="Formatting">
    <button ngToolbarWidget value="bold">B</button>
    <button ngToolbarWidget value="italic">I</button>
    <button ngToolbarWidget value="underline">U</button>
  </div>
</div>
```

## Disabled Widgets

### Soft Disabled (Default)

Disabled widgets remain focusable but show unavailable state:

```html
<div ngToolbar [softDisabled]="true">
  <button ngToolbarWidget value="cut" [disabled]="true">Cut</button>
  <button ngToolbarWidget value="copy">Copy</button>
</div>
```

### Hard Disabled

Disabled widgets removed from keyboard navigation:

```html
<div ngToolbar [softDisabled]="false">
  <button ngToolbarWidget value="cut" [disabled]="true">Cut</button>
  <button ngToolbarWidget value="copy">Copy</button>
</div>
```

## RTL Support

```html
<div dir="rtl">
  <div ngToolbar aria-label="أدوات">
    <button ngToolbarWidget value="bold">غامق</button>
    <button ngToolbarWidget value="italic">مائل</button>
  </div>
</div>
```

Arrow navigation automatically reverses.

## Toolbar API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `orientation` | `'vertical' \| 'horizontal'` | `'horizontal'` | Layout direction |
| `disabled` | `boolean` | `false` | Disables entire toolbar |
| `softDisabled` | `boolean` | `true` | Disabled items focusable |
| `wrap` | `boolean` | `true` | Focus wraps at edges |

## ToolbarWidget API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | auto | Unique identifier |
| `disabled` | `boolean` | `false` | Disables widget |
| `value` | `V` | - | Value (required) |

### Signals

| Property | Type | Description |
|----------|------|-------------|
| `active` | `Signal<boolean>` | Whether widget is focused |
| `selected` | `Signal<boolean>` | Whether widget is selected (in group) |

## ToolbarWidgetGroup API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disables all widgets |
| `multi` | `boolean` | `false` | Multiple selection allowed |

## Key Points

- Single tab stop for entire toolbar
- Arrow keys navigate between widgets
- Enter/Space activate widgets
- Groups maintain internal selection state
- Supports trees, comboboxes within toolbar

<!--
Source references:
- https://angular.dev/guide/aria/toolbar
-->
