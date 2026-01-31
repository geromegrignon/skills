---
name: cdk-keycodes
description: Keyboard key code constants for handling keyboard events
---

# CDK Keycodes

## Imports

```ts
// Navigation keys
import { UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, HOME, END, PAGE_UP, PAGE_DOWN } from '@angular/cdk/keycodes';

// Action keys
import { ENTER, SPACE, TAB, ESCAPE, BACKSPACE, DELETE } from '@angular/cdk/keycodes';

// Modifier keys
import { SHIFT, CONTROL, ALT, META } from '@angular/cdk/keycodes';

// Helper function
import { hasModifierKey } from '@angular/cdk/keycodes';
```

Constants for commonly used keyboard key codes.

## Basic Usage

```ts
import { Component, HostListener } from '@angular/core';
import { 
  ENTER, 
  ESCAPE, 
  SPACE, 
  TAB,
  UP_ARROW, 
  DOWN_ARROW, 
  LEFT_ARROW, 
  RIGHT_ARROW 
} from '@angular/cdk/keycodes';

@Component({
  selector: 'my-component',
  template: `<div>Press arrow keys</div>`
})
export class App {
  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case UP_ARROW:
        this.moveUp();
        break;
      case DOWN_ARROW:
        this.moveDown();
        break;
      case ENTER:
      case SPACE:
        this.select();
        break;
      case ESCAPE:
        this.close();
        break;
    }
  }
}
```

## Available Key Codes

### Navigation

```ts
import {
  UP_ARROW,      // 38
  DOWN_ARROW,    // 40
  LEFT_ARROW,    // 37
  RIGHT_ARROW,   // 39
  HOME,          // 36
  END,           // 35
  PAGE_UP,       // 33
  PAGE_DOWN,     // 34
} from '@angular/cdk/keycodes';
```

### Action Keys

```ts
import {
  ENTER,         // 13
  SPACE,         // 32
  TAB,           // 9
  ESCAPE,        // 27
  BACKSPACE,     // 8
  DELETE,        // 46
} from '@angular/cdk/keycodes';
```

### Modifier Keys

```ts
import {
  SHIFT,         // 16
  CONTROL,       // 17
  ALT,           // 18
  META,          // 91 (Command on Mac, Windows key on PC)
} from '@angular/cdk/keycodes';
```

### Function Keys

```ts
import {
  F1,  F2,  F3,  F4,
  F5,  F6,  F7,  F8,
  F9,  F10, F11, F12,
} from '@angular/cdk/keycodes';
```

### Letters (A-Z)

```ts
import {
  A, B, C, D, E, F, G, H, I, J, K, L, M,
  N, O, P, Q, R, S, T, U, V, W, X, Y, Z
} from '@angular/cdk/keycodes';
```

### Numbers

```ts
import {
  ZERO, ONE, TWO, THREE, FOUR,
  FIVE, SIX, SEVEN, EIGHT, NINE
} from '@angular/cdk/keycodes';
```

### Numpad

```ts
import {
  NUMPAD_ZERO, NUMPAD_ONE, NUMPAD_TWO,
  NUMPAD_THREE, NUMPAD_FOUR, NUMPAD_FIVE,
  NUMPAD_SIX, NUMPAD_SEVEN, NUMPAD_EIGHT, NUMPAD_NINE,
  NUMPAD_MULTIPLY,  // *
  NUMPAD_PLUS,      // +
  NUMPAD_MINUS,     // -
  NUMPAD_PERIOD,    // .
  NUMPAD_DIVIDE,    // /
} from '@angular/cdk/keycodes';
```

### Special Characters

```ts
import {
  COMMA,            // ,
  SEMICOLON,        // ;
  APOSTROPHE,       // '
  OPEN_SQUARE_BRACKET,  // [
  CLOSE_SQUARE_BRACKET, // ]
  SLASH,            // /
  BACKSLASH,        // \
  DASH,             // -
  EQUALS,           // =
  TILDE,            // ~
} from '@angular/cdk/keycodes';
```

## Helper Functions

### hasModifierKey

Check if any modifier key is pressed:

```ts
import { hasModifierKey } from '@angular/cdk/keycodes';

handleKeydown(event: KeyboardEvent): void {
  // Check if any modifier is pressed (Shift, Ctrl, Alt, Meta)
  if (hasModifierKey(event)) {
    return;
  }

  // Check for specific modifiers
  if (hasModifierKey(event, 'shiftKey')) {
    // Shift is pressed
  }

  if (hasModifierKey(event, 'ctrlKey', 'metaKey')) {
    // Either Ctrl or Meta (Cmd) is pressed
  }
}
```

## Directive Example

```ts
import { Directive, HostListener, Output, EventEmitter } from '@angular/core';
import { UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';

@Directive({
  selector: '[arrowNavigable]'
})
export class ArrowNavigableDirective {
  navigate = output<EventEmitter<'up' | 'down' | 'left' | 'right'>>();

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const directions: Record<number, 'up' | 'down' | 'left' | 'right'> = {
      [UP_ARROW]: 'up',
      [DOWN_ARROW]: 'down',
      [LEFT_ARROW]: 'left',
      [RIGHT_ARROW]: 'right'
    };

    const direction = directions[event.keyCode];
    if (direction) {
      event.preventDefault();
      this.navigate.emit(direction);
    }
  }
}
```

## Menu Navigation Example

```ts
import { 
  UP_ARROW, DOWN_ARROW, ENTER, SPACE, ESCAPE, TAB, HOME, END 
} from '@angular/cdk/keycodes';

handleMenuKeydown(event: KeyboardEvent): void {
  switch (event.keyCode) {
    case UP_ARROW:
      this.focusPrevious();
      event.preventDefault();
      break;
    case DOWN_ARROW:
      this.focusNext();
      event.preventDefault();
      break;
    case HOME:
      this.focusFirst();
      event.preventDefault();
      break;
    case END:
      this.focusLast();
      event.preventDefault();
      break;
    case ENTER:
    case SPACE:
      this.selectFocused();
      event.preventDefault();
      break;
    case ESCAPE:
    case TAB:
      this.closeMenu();
      break;
  }
}
```

## Key Points

- Constants for keyboard key codes (deprecated `keyCode` property)
- Useful for keyboard navigation and shortcuts
- `hasModifierKey()` helper for checking modifiers
- Used internally by CDK components
- Consider using `event.key` for modern browsers

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/keycodes/keycodes.md
- https://material.angular.dev/cdk/keycodes/overview
-->
