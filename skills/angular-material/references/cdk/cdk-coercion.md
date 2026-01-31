---
name: cdk-coercion
description: Utility functions for coercing @Input values into specific types
---

# CDK Coercion

## Imports

```ts
import { 
  coerceBooleanProperty, 
  coerceNumberProperty, 
  coerceStringArray,
  coerceElement,
  coerceCssPixelValue,
  BooleanInput, 
  NumberInput 
} from '@angular/cdk/coercion';
```

Utility functions for converting `@Input` values to specific types.

## coerceBooleanProperty

Convert any value to boolean. Useful for attribute-style inputs:

```ts
import { Directive, Input } from '@angular/core';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';

@Directive({
  selector: '[myDirective]',
  host: {
    '[class.disabled]': 'disabled'
  }
})
export class MyDirective {
  disabled = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.disabled.set(coerceBooleanProperty(this.disabled()));
    });
  }
}
```

Usage in templates:

```html
<!-- All these work: -->
<div myDirective disabled></div>
<div myDirective disabled="true"></div>
<div myDirective [disabled]="true"></div>
<div myDirective disabled=""></div>
```

## coerceNumberProperty

Convert any value to number with fallback:

```ts
import { Component, Input } from '@angular/core';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';

@Component({
  selector: 'my-component',
  template: `Delay: {{ delay }}ms`
})
export class App {
  delay = signal<number>(0);

  constructor() {
    effect(() => {
      this.delay.set(coerceNumberProperty(this.delay()));
    });
  }
}
```

Usage:

```html
<!-- String converted to number: -->
<my-component delay="500" />

<!-- Direct number binding: -->
<my-component [delay]="500" />
```

## coerceStringArray

Convert a value to an array of strings:

```ts
import { Input } from '@angular/core';
import { coerceStringArray } from '@angular/cdk/coercion';

classes = signal<string[]>([]);

constructor() {
  effect(() => {
    this.classes.set(coerceStringArray(this.classes()));
  });
}
```

Usage:

```html
<!-- Single string: -->
<my-component classes="active" />

<!-- Array: -->
<my-component [classes]="['active', 'highlighted']" />
```

## coerceElement

Get DOM element from ElementRef or raw element:

```ts
import { ElementRef } from '@angular/core';
import { coerceElement } from '@angular/cdk/coercion';

doSomething(elementOrRef: ElementRef<HTMLElement> | HTMLElement): void {
  const element: HTMLElement = coerceElement(elementOrRef);
  // Now you have the raw DOM element
  element.focus();
}
```

## coerceCssPixelValue

Convert number to CSS pixel string:

```ts
import { coerceCssPixelValue } from '@angular/cdk/coercion';

coerceCssPixelValue(100);     // '100px'
coerceCssPixelValue('100');   // '100px'
coerceCssPixelValue('100px'); // '100px'
coerceCssPixelValue('auto');  // 'auto'
```

## Type Aliases

Use these for proper typing:

```ts
import { BooleanInput, NumberInput } from '@angular/cdk/coercion';

// BooleanInput = boolean | string | null | undefined
// NumberInput = number | string | null | undefined
```

## Complete Example

```ts
import { Component, Input } from '@angular/core';
import {
  coerceBooleanProperty,
  coerceNumberProperty,
  BooleanInput,
  NumberInput
} from '@angular/cdk/coercion';

@Component({
  selector: 'app-button',
  template: `
    <button 
      [disabled]="disabled"
      [style.width.px]="width">
      <ng-content></ng-content>
    </button>
  `
})
export class AppButton {
  disabled = signal<boolean>(false);
  width = signal<number>(100);

  constructor() {
    effect(() => {
      this.disabled.set(coerceBooleanProperty(this.disabled()));
    });

     effect(() => {
      this.width.set(coerceNumberProperty(this.width(), 100));
    });
  }
}
```

```html
<app-button disabled width="200">Click me</app-button>
```

## Key Points

- `coerceBooleanProperty` - converts to boolean (empty string = true)
- `coerceNumberProperty` - converts to number with fallback
- `coerceStringArray` - converts to string array
- `coerceElement` - extracts DOM element from ElementRef
- `coerceCssPixelValue` - converts to CSS pixel string
- Use `BooleanInput` and `NumberInput` types for setter parameters

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/coercion/coercion.md
- https://material.angular.dev/cdk/coercion/overview
-->
