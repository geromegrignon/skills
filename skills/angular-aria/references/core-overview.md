---
name: angular-aria-overview
description: Introduction to Angular Aria - headless accessible UI primitives
---

# Angular Aria Overview

Angular Aria is a collection of headless, accessible directives implementing common WAI-ARIA patterns. The directives handle keyboard interactions, ARIA attributes, focus management, and screen reader support.

## Installation

```shell
npm install @angular/aria
```

## What Angular Aria Handles

For each component pattern, Angular Aria provides:

- **Keyboard navigation** - Arrow keys, Home/End, Enter/Space, Escape handling
- **Screen reader support** - Proper ARIA attributes for assistive technologies
- **Focus management** - Logical focus movement between interactive elements
- **RTL support** - Automatic right-to-left language navigation

## When to Use Angular Aria

Use Angular Aria when you need:

- **Building a design system** - Component library with specific visual standards requiring accessible implementations
- **Enterprise component libraries** - Reusable components for multiple applications within an organization
- **Custom brand requirements** - Interface matching precise design specifications

## When NOT to Use Angular Aria

Angular Aria might not fit when:

- **Pre-styled components needed** - Use Angular Material instead for ready-to-use styled components
- **Simple forms** - Native HTML controls like `<button>` and `<input type="radio">` provide built-in accessibility
- **Rapid prototyping** - Pre-styled component libraries reduce initial development time

## Available Patterns

### Search and Selection

| Component | Description |
|-----------|-------------|
| Autocomplete | Text input with filtered suggestions |
| Listbox | Single or multi-select option lists |
| Select | Single-selection dropdown |
| Multiselect | Multiple-selection dropdown |
| Combobox | Primitive coordinating input with popup |

### Navigation and Actions

| Component | Description |
|-----------|-------------|
| Menu | Dropdown menus with submenus |
| Menubar | Horizontal application menu bar |
| Toolbar | Grouped controls with keyboard navigation |

### Content Organization

| Component | Description |
|-----------|-------------|
| Accordion | Collapsible content panels |
| Tabs | Tabbed interfaces |
| Tree | Hierarchical lists |
| Grid | Two-dimensional data navigation |

<!--
Source references:
- https://angular.dev/guide/aria/overview
-->
