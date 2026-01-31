---
name: component-tooltip
description: Text labels displayed on hover or long-press
---

# Tooltip

## Imports

```ts
import { MatTooltipModule, MatTooltip, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
```

Informative text labels that appear on hover or focus.

## Basic Usage

```html
<button mat-icon-button matTooltip="Delete item">
  <mat-icon>delete</mat-icon>
</button>

<span matTooltip="More information here">Hover me</span>
```

## Position

```html
<button matTooltip="Above" matTooltipPosition="above">Above</button>
<button matTooltip="Below" matTooltipPosition="below">Below</button>
<button matTooltip="Left" matTooltipPosition="left">Left</button>
<button matTooltip="Right" matTooltipPosition="right">Right</button>
```

### RTL-Aware Positions

```html
<button matTooltip="Before" matTooltipPosition="before">Before</button>
<button matTooltip="After" matTooltipPosition="after">After</button>
```

- `before`: Left in LTR, Right in RTL
- `after`: Right in LTR, Left in RTL

## Show/Hide Delays

```html
<button matTooltip="Delayed tooltip"
        [matTooltipShowDelay]="1000"
        [matTooltipHideDelay]="500">
  Hover (1s delay)
</button>
```

## Global Defaults

```ts
providers: [
  {
    provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
    useValue: {
      showDelay: 500,
      hideDelay: 200,
      touchendHideDelay: 1500,
      position: 'above'
    }
  }
]
```

## Disabled Tooltip

```html
<button matTooltip="Won't show" [matTooltipDisabled]="true">
  Disabled tooltip
</button>

<button matTooltip="Show conditionally" [matTooltipDisabled]="!showTooltip">
  Conditional
</button>
```

## Programmatic Control

```html
<button matTooltip="Manual tooltip" #tooltip="matTooltip">
  Manual control
</button>
<button (click)="tooltip.show()">Show</button>
<button (click)="tooltip.hide()">Hide</button>
<button (click)="tooltip.toggle()">Toggle</button>
```

With delay:

```ts
tooltip = viewChild.required<MatTooltip>(MatTooltip);

showDelayed(): void {
  this.tooltip().show(1000); // Show after 1 second
}

hideDelayed(): void {
  this.tooltip().hide(500); // Hide after 500ms
}
```

## Position at Origin

Show tooltip at mouse/touch location:

```html
<div matTooltip="At pointer" [matTooltipPositionAtOrigin]="true">
  Large area - tooltip follows pointer
</div>
```

## Touch Devices

- Tooltip appears on long-press
- Hides after 1500ms by default
- Configure with `touchendHideDelay`

## Multi-Line Tooltips

```html
<button [matTooltip]="longMessage">
  Multi-line tooltip
</button>
```

```ts
longMessage = `This is a longer tooltip message
that spans multiple lines for more detailed
information.`;
```

## Dynamic Content

```html
<button [matTooltip]="getTooltipText()">
  Dynamic tooltip
</button>
```

```ts
getTooltipText(): string {
  return `Last updated: ${this.lastUpdate.toLocaleString()}`;
}
```

## Tooltip Class

Custom styling via CSS class:

```html
<button matTooltip="Styled" matTooltipClass="custom-tooltip">
  Custom style
</button>
```

```scss
.custom-tooltip {
  font-size: 14px;
  background-color: purple;
}
```

## Common Patterns

### Icon Button with Tooltip

```html
<button mat-icon-button matTooltip="Settings" aria-label="Settings">
  <mat-icon>settings</mat-icon>
</button>
```

### Truncated Text

```html
<span class="truncated-text" 
      [matTooltip]="fullText"
      [matTooltipDisabled]="!isTextTruncated">
  {{ truncatedText }}
</span>
```

### Disabled Element Tooltip

Tooltips don't show on disabled elements. Wrap in a span:

```html
<span matTooltip="Button is disabled because...">
  <button mat-button disabled>Disabled</button>
</span>
```

## Accessibility

- Tooltip adds `aria-describedby` to host element
- Content is in a visually hidden element (always in DOM)
- Use with keyboard-accessible elements (buttons, links)

```html
<!-- Good: button is focusable -->
<button matTooltip="Delete this item">Delete</button>

<!-- Avoid: span is not naturally focusable -->
<span matTooltip="Info">Hover only</span>

<!-- Better: make it focusable -->
<span matTooltip="Info" tabindex="0">Keyboard accessible</span>
```

## Key Points

- Position: `above`, `below`, `left`, `right`, `before`, `after`
- Control delays with `matTooltipShowDelay` and `matTooltipHideDelay`
- `matTooltipDisabled` to conditionally disable
- Programmatic control via template reference
- Long-press triggers on mobile (1500ms default hide)
- Ensure tooltip hosts are keyboard accessible

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/tooltip/tooltip.md
- https://material.angular.dev/components/tooltip/overview
-->
