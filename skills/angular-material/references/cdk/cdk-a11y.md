---
name: cdk-a11y
description: CDK accessibility utilities for focus management, keyboard navigation, and screen readers
---

# CDK Accessibility (A11y)

## Imports

```ts
import { A11yModule } from '@angular/cdk/a11y';
import { 
  FocusKeyManager, 
  ActiveDescendantKeyManager, 
  FocusableOption, 
  Highlightable 
} from '@angular/cdk/a11y';
import { TreeKeyManager } from '@angular/cdk/a11y';
import { FocusTrap, FocusTrapFactory, CdkTrapFocus } from '@angular/cdk/a11y';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { InteractivityChecker } from '@angular/cdk/a11y';
```

The a11y package provides tools to improve accessibility for keyboard navigation, focus management, and screen readers.

## ListKeyManager

Manages keyboard navigation for lists (menus, listboxes):

```ts
import {FocusKeyManager} from '@angular/cdk/a11y';

items = viewChildren<MenuItemDirective>(MenuItemDirective);
private keyManager: FocusKeyManager<MenuItemDirective>;

constructor() {
  afterNextRender(() => {
    this.keyManager = new FocusKeyManager(this.items)
      .withWrap()           // Arrow keys wrap around
      .withHomeAndEnd()     // Home/End key support
      .withTypeAhead();     // Type-ahead search
  });
}

onKeydown(event: KeyboardEvent): void {
  this.keyManager.onKeydown(event);
}
```

### FocusKeyManager

For options that receive browser focus directly. Items must implement:

```ts
interface FocusableOption {
  focus(): void;
  disabled?: boolean;
  getLabel?(): string;
}
```

### ActiveDescendantKeyManager

For options marked active via `aria-activedescendant`. Items must implement:

```ts
interface Highlightable {
  setActiveStyles(): void;
  setInactiveStyles(): void;
  disabled?: boolean;
  getLabel?(): string;
}
```

## TreeKeyManager

For tree structures (`role="tree"`):

```ts
import {TreeKeyManager} from '@angular/cdk/a11y';

this.treeKeyManager = new TreeKeyManager({
  items: this.treeItems,
  // Navigation behavior options...
});
```

## FocusTrap

Traps Tab key focus within an element (essential for modal dialogs):

```html
<div class="modal-content" cdkTrapFocus>
  <!-- Tab cannot escape this container -->
  <input type="text">
  <button>Submit</button>
</div>
```

### Focus Regions

Define explicit focus boundaries and initial focus:

```html
<a cdkFocusRegionStart>First focusable</a>
<a cdkFocusInitial>Initially focused</a>
<a cdkFocusRegionEnd>Last focusable</a>
```

Enable auto-capture on initialization:

```html
<div cdkTrapFocus [cdkTrapFocusAutoCapture]="true">
  <button cdkFocusInitial>This gets focus immediately</button>
</div>
```

## LiveAnnouncer

Announces messages to screen readers via `aria-live` region:

```ts
import {LiveAnnouncer} from '@angular/cdk/a11y';

private liveAnnouncer = inject(LiveAnnouncer);

announceChange(): void {
  this.liveAnnouncer.announce('Item deleted', 'polite');
  // Politeness: 'polite' (waits) or 'assertive' (interrupts)
}
```

## FocusMonitor

Tracks focus origin (mouse, keyboard, touch, or programmatic):

```ts
import {FocusMonitor, FocusOrigin} from '@angular/cdk/a11y';


private focusMonitor = inject(FocusMonitor);

constructor() {
  afterNextRender(() => {
    this.focusMonitor.monitor(this.elementRef)
      .subscribe((origin: FocusOrigin) => {
        // origin: 'mouse' | 'keyboard' | 'touch' | 'program' | null
        if (origin === 'keyboard') {
          this.showFocusRing = true;
        }
      }); 
  });
}

ngOnDestroy() {
  this.focusMonitor.stopMonitoring(this.elementRef);
}
```

### Focus with Specific Origin

Simulate a specific focus origin:

```ts
this.focusMonitor.focusVia(element, 'keyboard');
```

### Directive Alternatives

```html
<!-- Monitor element only -->
<button cdkMonitorElementFocus (cdkFocusChange)="onFocusChange($event)">
  Button
</button>

<!-- Monitor element and all descendants -->
<div cdkMonitorSubtreeFocus (cdkFocusChange)="onFocusChange($event)">
  <button>Button 1</button>
  <button>Button 2</button>
</div>
```

## InteractivityChecker

Check element interactivity states:

```ts
import {InteractivityChecker} from '@angular/cdk/a11y';

private checker = inject(InteractivityChecker);

checkElement(element: HTMLElement) {
  this.checker.isFocusable(element);
  this.checker.isTabbable(element);
  this.checker.isDisabled(element);
  this.checker.isVisible(element);
}
```

## Styling Utilities

### Visually Hidden (Screen Reader Only)

```scss
@use '@angular/cdk';

@include cdk.a11y-visually-hidden();
```

```html
<span class="cdk-visually-hidden">Screen reader text</span>
```

### High Contrast Mode Styles

```scss
@use '@angular/cdk';

button {
  @include cdk.high-contrast {
    outline: solid 1px;
  }
}

// Target specific mode
button {
  @include cdk.high-contrast($target: active) {
    border: 2px solid;
  }
}
```

## CSS Classes Applied by FocusMonitor

- `.cdk-focused` - Element is focused
- `.cdk-keyboard-focused` - Focused via keyboard
- `.cdk-mouse-focused` - Focused via mouse
- `.cdk-touch-focused` - Focused via touch
- `.cdk-program-focused` - Focused programmatically

## Key Points

- Use `FocusKeyManager` for lists with focusable items
- Use `ActiveDescendantKeyManager` for virtual focus patterns
- `cdkTrapFocus` is essential for modal dialogs
- `LiveAnnouncer` makes dynamic changes accessible to screen readers
- `FocusMonitor` enables keyboard-specific focus styling
- Always `stopMonitoring()` in `ngOnDestroy` to prevent leaks

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/a11y/a11y.md
- https://material.angular.dev/cdk/a11y/overview
-->
