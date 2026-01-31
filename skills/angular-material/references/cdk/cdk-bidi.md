---
name: cdk-bidi
description: Bidirectionality utilities for LTR/RTL layout direction handling
---

# CDK Bidi

## Imports

```ts
import { BidiModule, Dir, Direction, Directionality } from '@angular/cdk/bidi';
```

Utilities for handling LTR (left-to-right) and RTL (right-to-left) layout directions.

## Directionality Service

Inject `Directionality` to get the current direction:

```ts
import { Component, OnDestroy } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { Subscription } from 'rxjs';

@Component({
  selector: 'my-widget',
  template: `<div>Direction: {{ dir.value }}</div>`
})
export class MyWidget implements OnDestroy {
  private dirChangeSubscription = Subscription.EMPTY;
  isRtl = signal<boolean>(false);

  constructor(public dir: Directionality) {
    this.isRtl.set(dir.value === 'rtl');

    this.dirChangeSubscription = dir.change.subscribe(() => {
      this.isRtl.set(dir.value === 'rtl');
      this.handleDirectionChange();
    });
  }

  handleDirectionChange(): void {
    // React to direction change
  }

  ngOnDestroy() {
    this.dirChangeSubscription.unsubscribe();
  }
}
```

## Dir Directive

Match elements with `dir` attribute. Components inside get the correct direction context:

```html
<div dir="rtl">
  <!-- All components inside will have RTL direction -->
  <my-widget />
</div>

<div dir="ltr">
  <!-- All components inside will have LTR direction -->
  <my-widget />
</div>
```

The directive provides itself as `Directionality`, so any component that injects `Directionality` gets the closest ancestor's direction context.

## Directionality API

```ts
interface Directionality {
  // Current direction: 'ltr' or 'rtl'
  readonly value: Direction;
  
  // Emits when direction changes
  readonly change: EventEmitter<Direction>;
}
```

## Auto Direction

The `auto` value is supported:

```html
<div dir="auto">
  <!-- Direction resolved based on browser language -->
</div>
```

**Note:** CDK resolves `auto` by checking `navigator.language` against known RTL locales. This differs from browser behavior which uses text content.

## Conditional Styling

```ts
@Component({
  selector: 'my-component',
  template: `
    <div [class.rtl-layout]="isRtl">
      Content
    </div>
  `,
  styles: [`
    .rtl-layout {
      direction: rtl;
      text-align: right;
    }
  `]
})
export class MyComponent {
  isRtl = signal<boolean>(false);

  constructor(dir: Directionality) {
    this.isRtl.set(dir.value === 'rtl');
  }
}
```

## Key Points

- `Directionality` service provides current direction and change events
- `dir` directive creates direction context for descendants
- Values: `'ltr'`, `'rtl'`, `'auto'`
- `auto` resolved via browser language, not text content
- Used internally by overlays, keyboard navigation, and other CDK features

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/bidi/bidi.md
- https://material.angular.dev/cdk/bidi/overview
-->
