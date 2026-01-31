---
name: cdk-layout
description: CDK layout utilities for responsive design with BreakpointObserver
---

# CDK Layout

## Imports

```ts
import { LayoutModule } from '@angular/cdk/layout';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MediaMatcher } from '@angular/cdk/layout';
```

The layout package provides utilities for building responsive UIs that react to screen size changes.

## BreakpointObserver

### Check Current Viewport

```ts
import {BreakpointObserver} from '@angular/cdk/layout';

breakpointObserver = inject(BreakpointObserver);

checkSize(): void {
  const isSmall = this.breakpointObserver.isMatched('(max-width: 599px)');
  const isLarge = this.breakpointObserver.isMatched('(min-width: 1200px)');
}
```

### React to Viewport Changes

```ts
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';

constructor() {
  this.breakpointObserver.observe([
    '(orientation: portrait)',
    '(orientation: landscape)',
  ]).subscribe((state: BreakpointState) => {
    if (state.matches) {
      this.updateLayout();
    }
    
    // Check specific breakpoint
    if (state.breakpoints['(orientation: portrait)']) {
      this.showMobileLayout();
    }
  });
}
```

## Predefined Breakpoints

```ts
import {Breakpoints} from '@angular/cdk/layout';

this.breakpointObserver.observe([
  Breakpoints.HandsetPortrait,
  Breakpoints.TabletPortrait,
]).subscribe(result => {
  if (result.matches) {
    this.activateCompactLayout();
  }
});
```

### Available Breakpoints

| Breakpoint | Media Query |
|------------|-------------|
| `XSmall` | `(max-width: 599.98px)` |
| `Small` | `(min-width: 600px) and (max-width: 959.98px)` |
| `Medium` | `(min-width: 960px) and (max-width: 1279.98px)` |
| `Large` | `(min-width: 1280px) and (max-width: 1919.98px)` |
| `XLarge` | `(min-width: 1920px)` |

### Device-Oriented Breakpoints

| Breakpoint | Description |
|------------|-------------|
| `Handset` | Phone (any orientation) |
| `Tablet` | Tablet (any orientation) |
| `Web` | Desktop web (any orientation) |
| `HandsetPortrait` | Phone portrait |
| `HandsetLandscape` | Phone landscape |
| `TabletPortrait` | Tablet portrait |
| `TabletLandscape` | Tablet landscape |
| `WebPortrait` | Desktop portrait |
| `WebLandscape` | Desktop landscape |

## Practical Examples

### Responsive Navigation

```ts
@Component({
  template: `
    @if (isHandset$ | async) {
      <mat-sidenav-container>
        <mat-sidenav mode="over">...</mat-sidenav>
        <mat-sidenav-content>...</mat-sidenav-content>
      </mat-sidenav-container>
    } @else {
      <mat-sidenav-container>
        <mat-sidenav mode="side" opened>...</mat-sidenav>
        <mat-sidenav-content>...</mat-sidenav-content>
      </mat-sidenav-container>
    }
  `
})
export class NavComponent {
  breakpointObserver = inject(BreakpointObserver);

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
}
```

### Responsive Grid Columns

```ts
@Component({...})
export class GridComponent {
  breakpointObserver = inject(BreakpointObserver);

  columns = signal(4);
  
  constructor() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.columns.set(1);
      } else if (result.breakpoints[Breakpoints.Small]) {
        this.columns.set(2);
      } else if (result.breakpoints[Breakpoints.Medium]) {
        this.columns.set(3);
      } else {
        this.columns.set(4);
      }
    });
  }
}
```

## MediaMatcher

Low-level utility wrapping native `matchMedia`:

```ts
import {MediaMatcher} from '@angular/cdk/layout';

mediaMatcher = inject(MediaMatcher);

checkMedia(): void {
  const mediaQueryList = this.mediaMatcher.matchMedia('(min-width: 600px)');
  
  if (mediaQueryList.matches) {
    // Viewport is at least 600px wide
  }
  
  // Listen for changes
  mediaQueryList.addEventListener('change', (event) => {
    console.log('Match changed:', event.matches);
  });
}
```

## Key Points

- `BreakpointObserver` is the recommended high-level API
- `observe()` returns an observable; `isMatched()` is synchronous
- Use predefined `Breakpoints` for Material Design responsive patterns
- `MediaMatcher` normalizes browser differences for `matchMedia`
- Breakpoints follow Material Design responsive UI guidelines
- Multiple media queries can be observed simultaneously

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/layout/layout.md
- https://material.angular.dev/cdk/layout/overview
-->
