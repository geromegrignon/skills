---
name: component-badge
description: Small status descriptors attached to UI elements
---

# Badge

## Imports

```ts
import { MatBadgeModule } from '@angular/material/badge';
```

Small status indicators attached to block-level elements.

## Basic Usage

```html
<span matBadge="4">Notifications</span>

<button mat-icon-button matBadge="8" matBadgeDescription="unread messages">
  <mat-icon>mail</mat-icon>
</button>
```

**Note:** Badges must be applied to block-level elements.

## Position

```html
<!-- Default: above after -->
<span matBadge="4">Default</span>

<!-- Position options -->
<span matBadge="4" matBadgePosition="above before">Above Before</span>
<span matBadge="4" matBadgePosition="above after">Above After</span>
<span matBadge="4" matBadgePosition="below before">Below Before</span>
<span matBadge="4" matBadgePosition="below after">Below After</span>
```

## Overlap

Control whether badge overlaps its content:

```html
<!-- Overlaps (default, good for icons) -->
<mat-icon matBadge="4">folder</mat-icon>

<!-- No overlap (good for text) -->
<span matBadge="4" [matBadgeOverlap]="false">Text content</span>
```

## Size

```html
<span matBadge="4" matBadgeSize="small">Small</span>
<span matBadge="4" matBadgeSize="medium">Medium (default)</span>
<span matBadge="4" matBadgeSize="large">Large</span>
```

**Note:** Small badges don't show label text - useful for "has notification" indicators.

## Visibility

```html
<span matBadge="4" [matBadgeHidden]="hideCount()">Messages</span>
```

```ts
hideCount = signal(false);

toggleBadge(): void {
  this.hideCount.set(!this.hideCount());
}
```

## Color

```html
<span matBadge="4" matBadgeColor="primary">Primary</span>
<span matBadge="4" matBadgeColor="accent">Accent</span>
<span matBadge="4" matBadgeColor="warn">Warn</span>
```

## Dynamic Content

```html
<span [matBadge]="unreadCount()">Messages</span>
```

```ts
unreadCount = signal(5);

addMessage(): void {
  this.unreadCount.set(this.unreadCount() + 1);
}
```

## Accessibility

Always provide a description for screen readers:

```html
<button mat-icon-button 
        matBadge="8" 
        matBadgeDescription="8 unread messages">
  <mat-icon>mail</mat-icon>
</button>
```

When badge is on a `<mat-icon>`:

```html
<!-- Icon is aria-hidden, so add context -->
<mat-icon matBadge="!" 
          matBadgeDescription="Important notification"
          aria-hidden="false" 
          aria-label="Folder with important notification">
  folder
</mat-icon>
```

## Key Points

- Must be on block-level elements
- Position with `matBadgePosition`: `above`/`below` + `before`/`after`
- Small size hides label (presence-only indicator)
- Toggle visibility with `matBadgeHidden`
- Always provide `matBadgeDescription` for accessibility

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/badge/badge.md
- https://material.angular.dev/components/badge/overview
-->
