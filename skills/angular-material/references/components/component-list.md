---
name: component-list
description: Lists for displaying items, navigation, actions, and selection
---

# List

## Imports

```ts
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider'; // For section dividers
import { MatIconModule } from '@angular/material/icon'; // For icons
```

Container component for displaying lists of items.

## Basic List

```html
<mat-list>
  <mat-list-item>Item 1</mat-list-item>
  <mat-list-item>Item 2</mat-list-item>
  <mat-list-item>Item 3</mat-list-item>
</mat-list>
```

## Multi-Line Items

```html
<mat-list>
  <mat-list-item>
    <span matListItemTitle>John Doe</span>
    <span matListItemLine>Software Engineer</span>
  </mat-list-item>
  <mat-list-item>
    <span matListItemTitle>Jane Smith</span>
    <span matListItemLine>Product Manager</span>
    <span matListItemLine>San Francisco</span>
  </mat-list-item>
</mat-list>
```

## List Item Directives

| Directive | Purpose |
|-----------|---------|
| `matListItemTitle` | Main title (required for multi-line) |
| `matListItemLine` | Additional text lines |
| `matListItemIcon` | Icon at the start |
| `matListItemAvatar` | Avatar image at the start |
| `matListItemMeta` | Content at the end |

## With Icons

```html
<mat-list>
  <mat-list-item>
    <mat-icon matListItemIcon>folder</mat-icon>
    <span matListItemTitle>Documents</span>
  </mat-list-item>
  <mat-list-item>
    <mat-icon matListItemIcon>photo</mat-icon>
    <span matListItemTitle>Photos</span>
  </mat-list-item>
</mat-list>
```

## With Avatars

```html
<mat-list>
  <mat-list-item>
    <img matListItemAvatar src="avatar1.jpg" alt="User avatar">
    <span matListItemTitle>Alice</span>
    <span matListItemLine>Online</span>
  </mat-list-item>
</mat-list>
```

## Meta Content

```html
<mat-list>
  <mat-list-item>
    <span matListItemTitle>Meeting</span>
    <span matListItemLine>Project discussion</span>
    <span matListItemMeta>3:00 PM</span>
  </mat-list-item>
</mat-list>
```

## Navigation List

```html
<mat-nav-list>
  <a mat-list-item routerLink="/dashboard" routerLinkActive #rla="routerLinkActive"
     [activated]="rla.isActive">
    <mat-icon matListItemIcon>dashboard</mat-icon>
    Dashboard
  </a>
  <a mat-list-item routerLink="/settings" routerLinkActive #rlb="routerLinkActive"
     [activated]="rlb.isActive">
    <mat-icon matListItemIcon>settings</mat-icon>
    Settings
  </a>
</mat-nav-list>
```

## Action List

```html
<mat-action-list>
  <button mat-list-item (click)="save()">
    <mat-icon matListItemIcon>save</mat-icon>
    Save
  </button>
  <button mat-list-item (click)="delete()">
    <mat-icon matListItemIcon>delete</mat-icon>
    Delete
  </button>
</mat-action-list>
```

## Selection List

```html
<mat-selection-list [(ngModel)]="selectedOptions">
  <mat-list-option value="apples">Apples</mat-list-option>
  <mat-list-option value="bananas">Bananas</mat-list-option>
  <mat-list-option value="oranges">Oranges</mat-list-option>
</mat-selection-list>
```

### Single Selection

```html
<mat-selection-list [multiple]="false" [(ngModel)]="selectedOption">
  <mat-list-option value="small">Small</mat-list-option>
  <mat-list-option value="medium">Medium</mat-list-option>
  <mat-list-option value="large">Large</mat-list-option>
</mat-selection-list>
```

## Sections with Dividers

```html
<mat-list>
  <h3 matSubheader>Folders</h3>
  <mat-list-item>
    <mat-icon matListItemIcon>folder</mat-icon>
    Documents
  </mat-list-item>
  
  <mat-divider />
  
  <h3 matSubheader>Files</h3>
  <mat-list-item>
    <mat-icon matListItemIcon>insert_drive_file</mat-icon>
    Report.pdf
  </mat-list-item>
</mat-list>
```

## Inset Divider

```html
<mat-list>
  <mat-list-item>Item 1</mat-list-item>
  <mat-divider inset />
  <mat-list-item>Item 2</mat-list-item>
</mat-list>
```

## Dense List

```html
<mat-list dense>
  <mat-list-item>Compact item 1</mat-list-item>
  <mat-list-item>Compact item 2</mat-list-item>
</mat-list>
```

## Accessibility

### Navigation List

```html
<mat-nav-list aria-label="Main navigation">
  <a mat-list-item href="/home">Home</a>
</mat-nav-list>
```

### Action List

```html
<mat-action-list role="list" aria-label="File actions">
  <button mat-list-item>Save</button>
</mat-action-list>
```

### Selection List

```html
<mat-selection-list aria-label="Select toppings">
  <mat-list-option>Cheese</mat-list-option>
</mat-selection-list>
```

### Static List

```html
<mat-list role="list">
  <mat-list-item role="listitem">Item</mat-list-item>
</mat-list>
```

## Key Points

- `mat-list` for static content display
- `mat-nav-list` for navigation links
- `mat-action-list` for action buttons
- `mat-selection-list` for selectable options
- Use directives: `matListItemTitle`, `matListItemIcon`, `matListItemAvatar`, `matListItemMeta`
- `mat-divider` separates sections (`inset` for icon alignment)
- Always add appropriate `aria-label` for accessibility

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/list/list.md
- https://material.angular.dev/components/list/overview
-->
