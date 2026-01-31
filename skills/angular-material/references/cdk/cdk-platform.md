---
name: cdk-platform
description: Utilities for detecting current platform and browser capabilities
---

# CDK Platform

## Imports

```ts
import { PlatformModule, Platform } from '@angular/cdk/platform';
import { 
  supportsPassiveEventListeners, 
  supportsScrollBehavior, 
  getSupportedInputTypes,
  getRtlScrollAxisType,
  normalizePassiveListenerOptions 
} from '@angular/cdk/platform';
```

Service for detecting the current platform and browser.

## Platform Service

```ts
import { Platform } from '@angular/cdk/platform';

@Component({...})
export class App {
  platform = inject(Platform);

  constructor() {
    if (this.platform.isBrowser) {
      // Running in browser
    }

    if (this.platform.IOS) {
      // iOS-specific logic
    }
  }
}
```

## Platform Properties

| Property | Description |
|----------|-------------|
| `isBrowser` | Running in browser (not SSR) |
| `EDGE` | Microsoft Edge browser |
| `TRIDENT` | Microsoft Trident engine (IE) |
| `BLINK` | Blink rendering engine (Chrome, Edge Chromium) |
| `WEBKIT` | WebKit rendering engine (Safari) |
| `IOS` | Apple iOS platform |
| `FIREFOX` | Firefox browser |
| `ANDROID` | Android platform |
| `SAFARI` | Safari browser |

## Usage Examples

### Browser-Specific Styling

```ts
@Component({
  selector: 'my-component',
  template: `
    <div 
      [class.ios]="platform.IOS"
      [class.android]="platform.ANDROID">
      Platform-specific content
    </div>
  `
})
export class App {
  platform = inject(Platform);
}
```

### SSR-Safe Code

```ts
@Component({...})
export class App implements OnInit {
  platform = inject(Platform);

  constructor() {
    if (this.platform.isBrowser) {
      // Safe to use window, document, localStorage, etc.
      const saved = localStorage.getItem('settings');
      this.initializeAnalytics();
    }
  }
}
```

### Browser Feature Detection

```ts
@Component({...})
export class App {
  platform = inject(Platform);

  copyToClipboard(text: string): void {
    if (this.platform.isBrowser && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      this.fallbackCopy(text);
    }
  }

  applyScrollBehavior(): void {
    // Safari needs different scroll handling
    if (this.platform.SAFARI) {
      this.useSafariScrolling();
    } else {
      this.useStandardScrolling();
    }
  }
}
```

### Mobile Detection

```ts
@Component({...})
export class ResponsiveComponent {
  platform = inject(Platform);

  isMobile = signal<boolean>(false);

  constructor() {
    this.isMobile.set(this.platform.IOS || this.platform.ANDROID);
  }

  handleTouch(): void {
    if (this.isMobile) {
      // Touch-optimized behavior
    }
  }
}
```

## Feature Detection Utilities

Additional utilities for specific features:

```ts
import { 
  supportsPassiveEventListeners,
  supportsScrollBehavior,
  getSupportedInputTypes,
  getRtlScrollAxisType,
  normalizePassiveListenerOptions
} from '@angular/cdk/platform';

// Check passive event listener support
const supportsPassive = supportsPassiveEventListeners();

// Check smooth scrolling support  
const supportsScroll = supportsScrollBehavior();

// Get supported input types
const inputTypes = getSupportedInputTypes();
// Returns Set<string> like {'text', 'number', 'email', 'date', ...}

// Get RTL scroll axis behavior
const rtlType = getRtlScrollAxisType();
// Returns: 'normal' | 'negated' | 'inverted'

// Normalize passive listener options
const options = normalizePassiveListenerOptions({ passive: true });
```

## Shadow DOM Detection

```ts
import { _getShadowRoot } from '@angular/cdk/platform';

// Get shadow root of an element (if any)
const shadowRoot = _getShadowRoot(element);
```

## Test Environment

```ts
import { _isTestEnvironment } from '@angular/cdk/platform';

// Check if running in test environment
if (_isTestEnvironment()) {
  // Disable animations, skip analytics, etc.
}
```

## Directive Example

```ts
@Directive({
  selector: '[mobileOnly]'
})
export class MobileOnlyDirective {
  platform = inject(Platform);
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  
  constructor() {
    if (!this.platform.IOS && !this.platform.ANDROID) {
      this.renderer.setStyle(this.elementRef().nativeElement, 'display', 'none');
    }
  }
}
```

## Key Points

- `Platform` service for browser/platform detection
- `isBrowser` for SSR-safe code
- Engine detection: `BLINK`, `WEBKIT`, `TRIDENT`
- Platform detection: `IOS`, `ANDROID`
- Browser detection: `SAFARI`, `FIREFOX`, `EDGE`
- Feature detection utilities for advanced use cases
- Inject via constructor or `inject(Platform)`

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/platform/platform.md
- https://github.com/angular/components/blob/main/src/cdk/platform/platform.ts
- https://material.angular.dev/cdk/platform/overview
-->
