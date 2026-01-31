---
name: cdk-overlay
description: CDK overlay system for floating panels with positioning and scroll strategies
---

# CDK Overlay

## Imports

```ts
import { OverlayModule, Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';
import { 
  GlobalPositionStrategy, 
  FlexibleConnectedPositionStrategy,
  ConnectedPosition 
} from '@angular/cdk/overlay';
import { 
  ScrollStrategy, 
  ScrollStrategyOptions,
  CloseScrollStrategy,
  BlockScrollStrategy,
  RepositionScrollStrategy 
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
```

The overlay package provides a way to open floating panels on the screen, used internally by dialogs, menus, tooltips, and more.

## Setup

Import the prebuilt styles (not needed if using Angular Material themes):

```scss
@import '@angular/cdk/overlay-prebuilt.css';
```

## Creating Overlays

```ts
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';

overlay = inject(Overlay);

openPanel(): void {
  const overlayRef: OverlayRef = this.overlay().create({
    height: '400px',
    width: '600px',
  });
  
  const portal = new ComponentPortal(MyPanelComponent);
  overlayRef.attach(portal);
}
```

## Configuration Options

```ts
const overlayRef = this.overlay.create({
  width: '600px',
  height: '400px',
  positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
  scrollStrategy: this.overlay.scrollStrategies.block(),
  hasBackdrop: true,
  backdropClass: 'cdk-overlay-dark-backdrop',
});
```

## Position Strategies

### Global Position

For modals and notifications positioned relative to viewport:

```ts
const positionStrategy = this.overlay.position()
  .global()
  .centerHorizontally()
  .centerVertically();

// Or specific positioning
const positionStrategy = this.overlay.position()
  .global()
  .top('50px')
  .left('50px');
```

### Connected Position

For menus, tooltips, and pickers positioned relative to a trigger element:

```ts
const positionStrategy = this.overlay.position()
  .flexibleConnectedTo(this.triggerElement)
  .withPositions([
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
    },
    // Fallback positions...
  ]);
```

### Flexible Connected Position Features

```ts
const positionStrategy = this.overlay.position()
  .flexibleConnectedTo(this.triggerElement)
  .withPositions([...])
  .withViewportMargin(10)           // Margin from viewport edge
  .withPush(true)                   // Push into viewport if doesn't fit
  .withGrowAfterOpen(true)          // Allow size growth while open
  .withTransformOriginOn('.menu');  // Set transform-origin for animations
```

## Scroll Strategies

### NoopScrollStrategy (Default)

Does nothing on scroll:

```ts
scrollStrategy: this.overlay.scrollStrategies.noop()
```

### CloseScrollStrategy

Closes overlay when user scrolls:

```ts
scrollStrategy: this.overlay.scrollStrategies.close()
```

### BlockScrollStrategy

Blocks page scrolling while overlay is open:

```ts
scrollStrategy: this.overlay.scrollStrategies.block()
```

### RepositionScrollStrategy

Repositions overlay on scroll (may impact performance):

```ts
scrollStrategy: this.overlay.scrollStrategies.reposition()
```

## Managing the Overlay

```ts
// Attach content
const componentRef = overlayRef.attach(new ComponentPortal(MyComponent));

// Detach content
overlayRef.detach();

// Dispose completely
overlayRef.dispose();

// Listen for backdrop clicks
overlayRef.backdropClick().subscribe(() => overlayRef.detach());

// Listen for keyboard events
overlayRef.keydownEvents().subscribe(event => {
  if (event.key === 'Escape') {
    overlayRef.detach();
  }
});
```

## Overlay Container

By default, overlays render in a container appended to `document.body`. For fullscreen support:

```ts
import {OverlayContainer, FullscreenOverlayContainer} from '@angular/cdk/overlay';

const appConfig: ApplicationConfig = {
  providers: [
    {provide: OverlayContainer, useClass: FullscreenOverlayContainer}
  ]
};
```

## Custom Position Strategy

Implement the `PositionStrategy` interface:

```ts
interface PositionStrategy {
  attach(overlayRef: OverlayRef): void;
  apply(): void;
  detach?(): void;
  dispose(): void;
}
```

## Custom Scroll Strategy

Implement `ScrollStrategy` and inject `ScrollDispatcher`:

```ts
interface ScrollStrategy {
  attach(overlayRef: OverlayRef): void;
  enable(): void;
  disable(): void;
  detach?(): void;
}
```

## Key Points

- `OverlayRef` is a `PortalOutlet` - use Portals to attach content
- Position strategies: `GlobalPositionStrategy` for modals, `FlexibleConnectedPositionStrategy` for dropdowns/menus
- Scroll strategies control behavior during scroll: noop, close, block, or reposition
- Backdrop clicks and keyboard events are observable
- Overlays avoid `overflow: hidden` clipping by rendering at document body level

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/overlay/overlay.md
- https://material.angular.dev/cdk/overlay/overview
-->
