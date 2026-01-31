---
name: component-divider
description: Line separator styled with Material Design
---

# Divider

## Imports

```ts
import { MatDividerModule } from '@angular/material/divider';
```

Simple line separator for visual content separation.

## Basic Usage

```html
<mat-divider />
```

## Vertical Divider

```html
<div class="container" style="display: flex; height: 100px;">
  <span>Left</span>
  <mat-divider [vertical]="true" />
  <span>Right</span>
</div>
```

## Inset Divider

Indented divider that aligns with content (useful in lists):

```html
<mat-divider [inset]="true" />
```

## In Lists

```html
<mat-list>
  <mat-list-item>
    <mat-icon matListItemIcon>folder</mat-icon>
    <span matListItemTitle>Documents</span>
  </mat-list-item>
  
  <mat-divider />
  
  <mat-list-item>
    <mat-icon matListItemIcon>folder</mat-icon>
    <span matListItemTitle>Photos</span>
  </mat-list-item>
</mat-list>
```

### Inset Dividers in Lists

Align with content, not icons:

```html
<mat-list>
  @for (item of items; track item; let last = $last) {
    <mat-list-item>
      <mat-icon matListItemIcon>{{item.icon}}</mat-icon>
      <span matListItemTitle>{{item.name}}</span>
    </mat-list-item>
    @if (!last) {
      <mat-divider [inset]="true" />
    }
  }
</mat-list>
```

**Note:** Avoid inset divider on last item to prevent overlap with section dividers.

## With Subheaders

```html
<mat-list>
  <h3 matSubheader>Section 1</h3>
  <mat-list-item>Item 1.1</mat-list-item>
  <mat-list-item>Item 1.2</mat-list-item>
  
  <mat-divider />
  
  <h3 matSubheader>Section 2</h3>
  <mat-list-item>Item 2.1</mat-list-item>
</mat-list>
```

## Styling

```scss
mat-divider {
  margin: 16px 0;
}

// Custom color
mat-divider {
  border-top-color: var(--mat-sys-outline-variant);
}
```

## Accessibility

`MatDivider` applies `role="separator"` automatically. This is a non-focusable separator that distinguishes sections of content.

## Key Points

- Simple horizontal line by default
- `[vertical]="true"` for vertical orientation
- `[inset]="true"` for indented dividers in lists
- Avoid inset on last list item
- Automatically has `role="separator"`
- Style with CSS for custom appearance

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/divider/divider.md
- https://material.angular.dev/components/divider/overview
-->
