---
name: component-expansion
description: Expandable panels and accordion for collapsible content
---

# Expansion Panel

## Imports

```ts
import { MatExpansionModule, MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
```

Collapsible content sections with expand/collapse functionality.

## Basic Panel

```html
<mat-expansion-panel>
  <mat-expansion-panel-header>
    <mat-panel-title>Personal data</mat-panel-title>
    <mat-panel-description>Enter your information</mat-panel-description>
  </mat-expansion-panel-header>
  
  <p>Content goes here...</p>
</mat-expansion-panel>
```

## Accordion

Multiple panels where only one can be open:

```html
<mat-accordion>
  <mat-expansion-panel>
    <mat-expansion-panel-header>
      <mat-panel-title>Step 1</mat-panel-title>
    </mat-expansion-panel-header>
    <p>First step content</p>
  </mat-expansion-panel>

  <mat-expansion-panel>
    <mat-expansion-panel-header>
      <mat-panel-title>Step 2</mat-panel-title>
    </mat-expansion-panel-header>
    <p>Second step content</p>
  </mat-expansion-panel>
</mat-accordion>
```

### Multi-Open Accordion

Allow multiple panels open simultaneously:

```html
<mat-accordion multi>
  <mat-expansion-panel>...</mat-expansion-panel>
  <mat-expansion-panel>...</mat-expansion-panel>
</mat-accordion>
```

## Hide Toggle Icon

```html
<mat-expansion-panel hideToggle>
  <mat-expansion-panel-header>
    No toggle icon
  </mat-expansion-panel-header>
</mat-expansion-panel>
```

## Disabled Panel

```html
<mat-expansion-panel disabled>
  <mat-expansion-panel-header>
    Cannot expand
  </mat-expansion-panel-header>
</mat-expansion-panel>
```

## Action Bar

Show actions only when expanded:

```html
<mat-expansion-panel>
  <mat-expansion-panel-header>
    <mat-panel-title>Edit Profile</mat-panel-title>
  </mat-expansion-panel-header>
  
  <form>
    <mat-form-field>
      <input matInput placeholder="Name">
    </mat-form-field>
  </form>
  
  <mat-action-row>
    <button mat-button>Cancel</button>
    <button mat-button color="primary">Save</button>
  </mat-action-row>
</mat-expansion-panel>
```

## Lazy Content

Defer initialization until panel opens:

```html
<mat-expansion-panel>
  <mat-expansion-panel-header>Heavy Content</mat-expansion-panel-header>
  
  <ng-template matExpansionPanelContent>
    <!-- Only initialized when panel opens -->
    <expensive-component />
  </ng-template>
</mat-expansion-panel>
```

## Programmatic Control

```ts
panel = viewChild.required<MatExpansionPanel>(MatExpansionPanel);

expand(): void {
  this.panel().open();
}

collapse(): void {
  this.panel().close();
}

toggle(): void {
  this.panel().toggle();
}
```

### Accordion Control

```ts
accordion = viewChild.required<MatAccordion>(MatAccordion);

openAll(): void {
  this.accordion().openAll();
}

closeAll(): void {
  this.accordion().closeAll();
}
```

## Events

```html
<mat-expansion-panel 
    (opened)="onOpen()"
    (closed)="onClose()"
    (afterExpand)="afterExpanded()"
    (afterCollapse)="afterCollapsed()">
```

## Expanded State Binding

```html
<mat-expansion-panel [(expanded)]="isExpanded">
  <mat-expansion-panel-header>
    Panel is {{ isExpanded ? 'open' : 'closed' }}
  </mat-expansion-panel-header>
</mat-expansion-panel>
```

## Toggle Position

```html
<mat-accordion togglePosition="before">
  <!-- Toggle icon on left side -->
</mat-accordion>
```

## Display Modes

```html
<mat-accordion displayMode="default">
  <!-- Spacing between panels (default) -->
</mat-accordion>

<mat-accordion displayMode="flat">
  <!-- No spacing, panels flush together -->
</mat-accordion>
```

## Accessibility

- Header has `role="button"` with `aria-controls` referencing content
- Don't add interactive elements (buttons, links) inside header
- Panel header automatically handles keyboard activation

```html
<mat-expansion-panel>
  <mat-expansion-panel-header>
    <!-- Don't do this: -->
    <!-- <button>Bad</button> -->
    
    <!-- Just use text and icons -->
    <mat-panel-title>Good Title</mat-panel-title>
  </mat-expansion-panel-header>
</mat-expansion-panel>
```

## Key Points

- `mat-accordion` groups panels (single or multi open)
- Use `multi` attribute to allow multiple panels open
- `mat-action-row` for action buttons at bottom
- Lazy load heavy content with `matExpansionPanelContent`
- `displayMode="flat"` removes spacing between panels
- Avoid interactive elements in header

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/expansion/expansion.md
- https://material.angular.dev/components/expansion/overview
-->
