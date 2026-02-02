---
name: angular-aria-accordion
description: Collapsible content panels with expand/collapse functionality
---

# Accordion

Organizes related content into expandable and collapsible sections, reducing page scrolling and helping users focus on relevant information.

## When to Use

Use Accordion when:
- Displaying FAQs with multiple questions/answers
- Organizing long forms into manageable sections
- Reducing scrolling on content-heavy pages
- Progressively disclosing related information

Avoid when:
- Building navigation menus → Use [Menu](navigation-menu.md)
- Creating tabbed interfaces → Use [Tabs](content-tabs.md)
- Showing single collapsible section → Use disclosure pattern
- Users need to see multiple sections simultaneously

## Basic Usage

```html
<div ngAccordionGroup>
  <div>
    <button ngAccordionTrigger panelId="panel-1">Section 1</button>
    <div ngAccordionPanel panelId="panel-1">
      Content for section 1
    </div>
  </div>
  <div>
    <button ngAccordionTrigger panelId="panel-2">Section 2</button>
    <div ngAccordionPanel panelId="panel-2">
      Content for section 2
    </div>
  </div>
</div>
```

## Single Expansion Mode

Only one panel open at a time:

```html
<div ngAccordionGroup [multiExpandable]="false">
  ...
</div>
```

Opening a new panel automatically closes the previously open one. Good for FAQs.

## Multiple Expansion Mode (Default)

Multiple panels can be open simultaneously:

```html
<div ngAccordionGroup [multiExpandable]="true">
  ...
</div>
```

Good for form sections or comparing content.

## Disabled Items

```html
<div ngAccordionGroup [softDisabled]="true">
  <div>
    <button ngAccordionTrigger panelId="panel-1">Enabled</button>
    <div ngAccordionPanel panelId="panel-1">Content</div>
  </div>
  <div>
    <button ngAccordionTrigger panelId="panel-2" [disabled]="true">Disabled</button>
    <div ngAccordionPanel panelId="panel-2">Content</div>
  </div>
</div>
```

- `softDisabled="true"`: Disabled items focusable but not activatable
- `softDisabled="false"`: Disabled items skipped during navigation

## Lazy Content Rendering

Defer rendering until panel first expands:

```html
<div ngAccordionPanel panelId="panel-1">
  <ng-template ngAccordionContent>
    <!-- Only renders when panel first opens -->
    <img src="large-image.jpg" alt="Description" />
    <app-expensive-component />
  </ng-template>
</div>
```

Set `[preserveContent]="false"` to remove content when panel closes.

## AccordionGroup API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disables all triggers |
| `multiExpandable` | `boolean` | `true` | Multiple panels can be open |
| `softDisabled` | `boolean` | `true` | Disabled items focusable |
| `wrap` | `boolean` | `false` | Navigation wraps at edges |

### Methods

| Method | Description |
|--------|-------------|
| `expandAll()` | Expands all panels (when multiExpandable) |
| `collapseAll()` | Collapses all panels |

## AccordionTrigger API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | auto | Unique identifier |
| `panelId` | `string` | - | Must match panel's panelId (required) |
| `disabled` | `boolean` | `false` | Disables trigger |
| `expanded` | `boolean` | `false` | Panel state (two-way bindable) |

### Signals

| Property | Type | Description |
|----------|------|-------------|
| `active` | `Signal<boolean>` | Whether trigger has focus |

### Methods

| Method | Description |
|--------|-------------|
| `expand()` | Expands panel |
| `collapse()` | Collapses panel |
| `toggle()` | Toggles panel |

## AccordionPanel API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | auto | Unique identifier |
| `panelId` | `string` | - | Must match trigger's panelId (required) |
| `preserveContent` | `boolean` | `true` | Keep content in DOM after collapse |

### Signals

| Property | Type | Description |
|----------|------|-------------|
| `visible` | `Signal<boolean>` | Whether panel is expanded |

## Key Points

- Arrow keys navigate between triggers
- Enter/Space toggle panels
- `panelId` links trigger to panel
- Content persists in DOM by default after first render

<!--
Source references:
- https://angular.dev/guide/aria/accordion
-->
