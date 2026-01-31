---
name: component-icon
description: Vector icon display with font icons and SVG support
---

# Icon

## Imports

```ts
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Required for SVG icons
```

Display vector icons from icon fonts or SVG files.

## Font Icons (Ligatures)

Using Material Icons font:

```html
<mat-icon>home</mat-icon>
<mat-icon>settings</mat-icon>
<mat-icon>favorite</mat-icon>
```

**Note:** Include the Material Icons font in your HTML:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

## Material Symbols

Use the newer Material Symbols font:

```ts
// Register font set
iconRegistry = inject(MatIconRegistry);

constructor() {
  this.iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
}
```

```html
<mat-icon>home</mat-icon>
```

## SVG Icons

### Register Individual Icons

```ts
iconRegistry = inject(MatIconRegistry);
sanitizer = inject(DomSanitizer);

constructor() {
  iconRegistry.addSvgIcon(
    'thumbs_up',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/thumbs-up.svg')
  );
}
```

```html
<mat-icon svgIcon="thumbs_up" />
```

### Register Icon Set

```ts
iconRegistry.addSvgIconSet(
  sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icons.svg')
);
```

```html
<mat-icon svgIcon="custom-icon" />
```

### Namespaced Icons

```ts
iconRegistry.addSvgIconInNamespace(
  'social',
  'twitter',
  sanitizer.bypassSecurityTrustResourceUrl('assets/icons/twitter.svg')
);
```

```html
<mat-icon svgIcon="social:twitter" />
```

### Inline SVG Literal

```ts
const svgContent = '<svg>...</svg>';
iconRegistry.addSvgIconLiteral(
  'custom',
  sanitizer.bypassSecurityTrustHtml(svgContent)
);
```

## Font Icon with CSS Classes

For icon fonts like Font Awesome:

```ts
iconRegistry.registerFontClassAlias('fontawesome', 'fa');
```

```html
<mat-icon fontSet="fontawesome" fontIcon="fa-home" />
```

## Icon Color

Icons inherit text color by default:

```html
<mat-icon color="primary">star</mat-icon>
<mat-icon color="accent">star</mat-icon>
<mat-icon color="warn">warning</mat-icon>

<mat-icon style="color: red">error</mat-icon>
```

## Icon in Buttons

```html
<button mat-icon-button aria-label="Settings">
  <mat-icon>settings</mat-icon>
</button>

<button mat-fab aria-label="Add">
  <mat-icon>add</mat-icon>
</button>

<button mat-button>
  <mat-icon>thumb_up</mat-icon>
  Like
</button>
```

## RTL Support

Mirror icons in RTL layouts:

```html
<mat-icon class="mat-icon-rtl-mirror" svgIcon="arrow_forward" />
```

## Accessibility

Icons are `aria-hidden="true"` by default.

### Decorative Icons

No action needed - they're already hidden from screen readers.

### Interactive Icons

Wrap in accessible element:

```html
<button mat-icon-button aria-label="Delete item">
  <mat-icon>delete</mat-icon>
</button>
```

### Indicator Icons

Add visually hidden description:

```html
<mat-icon>error</mat-icon>
<span class="cdk-visually-hidden">Error:</span>
<span>Something went wrong</span>
```

Or override aria-hidden:

```html
<mat-icon aria-hidden="false" aria-label="Warning indicator">warning</mat-icon>
```

## Key Points

- Supports font icons (ligatures and CSS classes) and SVG
- SVG icons require `MatIconRegistry` and `DomSanitizer`
- Icons inherit text `color` by default
- Use `mat-icon-rtl-mirror` class for RTL mirroring
- Always wrap interactive icons in accessible elements
- SVG URLs subject to same-origin policy

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/icon/icon.md
- https://material.angular.dev/components/icon/overview
-->
