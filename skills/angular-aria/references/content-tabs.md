---
name: angular-aria-tabs
description: Tabbed interfaces with automatic or manual activation modes
---

# Tabs

Displays layered content sections where only one panel is visible at a time. Users switch between panels by clicking tab buttons or using arrow keys.

## When to Use

Use Tabs when:
- Organizing related content into distinct sections
- Creating settings panels with categories
- Building documentation with multiple topics
- Implementing dashboards with different views
- Showing content where users switch contexts

Avoid when:
- Building sequential forms/wizards → Use stepper pattern
- Navigating between pages → Use router navigation
- Showing single content section
- More than 7-8 tabs → Consider different layout

## Basic Usage

```html
<div ngTabs>
  <ul ngTabList [(selectedTab)]="selectedTab">
    <li ngTab value="tab1">Tab 1</li>
    <li ngTab value="tab2">Tab 2</li>
    <li ngTab value="tab3">Tab 3</li>
  </ul>

  <div ngTabPanel value="tab1">Content for Tab 1</div>
  <div ngTabPanel value="tab2">Content for Tab 2</div>
  <div ngTabPanel value="tab3">Content for Tab 3</div>
</div>
```

## Selection Follows Focus (Default)

Tabs activate immediately when navigating with arrow keys:

```html
<ul ngTabList selectionMode="follow" [(selectedTab)]="selectedTab">
```

Best for lightweight content with instant feedback.

## Manual Activation

Arrow keys move focus without changing selection. Space/Enter activates:

```html
<ul ngTabList selectionMode="explicit" [(selectedTab)]="selectedTab">
```

Best for heavy content panels to avoid unnecessary rendering.

## Vertical Tabs

```html
<div ngTabs>
  <ul ngTabList orientation="vertical" [(selectedTab)]="selectedTab">
    <li ngTab value="general">General</li>
    <li ngTab value="security">Security</li>
    <li ngTab value="privacy">Privacy</li>
  </ul>
  
  <div ngTabPanel value="general">General settings</div>
  <div ngTabPanel value="security">Security settings</div>
  <div ngTabPanel value="privacy">Privacy settings</div>
</div>
```

Up/Down arrows navigate instead of Left/Right.

## Lazy Content Rendering

```html
<div ngTabPanel value="tab1">
  <ng-template ngTabContent>
    <!-- Only renders when tab is first shown -->
    <app-heavy-component />
  </ng-template>
</div>
```

Set `[preserveContent]="false"` to remove content when tab is deactivated.

## Disabled Tabs

```html
<ul ngTabList [softDisabled]="true" [(selectedTab)]="selectedTab">
  <li ngTab value="tab1">Enabled</li>
  <li ngTab value="tab2" [disabled]="true">Disabled</li>
  <li ngTab value="tab3">Enabled</li>
</ul>
```

- `softDisabled="true"`: Disabled tabs focusable but not activatable
- `softDisabled="false"`: Disabled tabs skipped during navigation

## TabList API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `wrap` | `boolean` | `false` | Navigation wraps at edges |
| `softDisabled` | `boolean` | `true` | Disabled tabs focusable |
| `selectionMode` | `'follow' \| 'explicit'` | `'follow'` | Activation behavior |
| `selectedTab` | `any` | - | Selected tab value (two-way) |

## Tab API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `any` | - | Unique value (required) |
| `disabled` | `boolean` | `false` | Disables this tab |

### Signals

| Property | Type | Description |
|----------|------|-------------|
| `selected` | `Signal<boolean>` | Whether tab is selected |
| `active` | `Signal<boolean>` | Whether tab has focus |

## TabPanel API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `any` | - | Must match tab's value (required) |
| `preserveContent` | `boolean` | `true` | Keep content in DOM after hide |

### Signals

| Property | Type | Description |
|----------|------|-------------|
| `visible` | `Signal<boolean>` | Whether panel is visible |

## Key Points

- Arrow keys navigate tabs
- Tab value links to panel value
- Supports horizontal and vertical layouts
- RTL automatically reverses navigation

<!--
Source references:
- https://angular.dev/guide/aria/tabs
-->
