---
name: component-grid-list
description: Two-dimensional grid layout for tiles
---

# Grid List

## Imports

```ts
import { MatGridListModule } from '@angular/material/grid-list';

// For responsive grids
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
```

Two-dimensional grid layout for arranging content in tiles.

## Basic Usage

```html
<mat-grid-list cols="4">
  <mat-grid-tile>Tile 1</mat-grid-tile>
  <mat-grid-tile>Tile 2</mat-grid-tile>
  <mat-grid-tile>Tile 3</mat-grid-tile>
  <mat-grid-tile>Tile 4</mat-grid-tile>
</mat-grid-list>
```

## Columns

Set number of columns (required):

```html
<mat-grid-list cols="3">
  <!-- 3-column grid -->
</mat-grid-list>
```

## Row Height

### Fixed Height

```html
<mat-grid-list cols="2" rowHeight="100px">
<mat-grid-list cols="2" rowHeight="5em">
```

### Ratio (Width:Height)

```html
<mat-grid-list cols="2" rowHeight="4:3">
<mat-grid-list cols="2" rowHeight="16:9">
```

### Fit to Container

```html
<div style="height: 400px;">
  <mat-grid-list cols="2" rowHeight="fit">
    <!-- Tiles fill available height -->
  </mat-grid-list>
</div>
```

Default is `1:1` (square tiles).

## Gutter Size

Space between tiles:

```html
<mat-grid-list cols="2" gutterSize="10px">
<mat-grid-list cols="2" gutterSize="1em">
```

Default is `1px`.

## Tile Spanning

### Column Span

```html
<mat-grid-list cols="4">
  <mat-grid-tile colspan="2">Wide tile</mat-grid-tile>
  <mat-grid-tile>Normal</mat-grid-tile>
  <mat-grid-tile>Normal</mat-grid-tile>
</mat-grid-list>
```

### Row Span

```html
<mat-grid-list cols="2" rowHeight="100px">
  <mat-grid-tile rowspan="2">Tall tile</mat-grid-tile>
  <mat-grid-tile>Normal</mat-grid-tile>
  <mat-grid-tile>Normal</mat-grid-tile>
</mat-grid-list>
```

### Both Spans

```html
<mat-grid-tile colspan="2" rowspan="2">Large tile</mat-grid-tile>
```

## Tile Header and Footer

```html
<mat-grid-tile>
  <mat-grid-tile-header>
    <mat-icon>photo</mat-icon>
    Header text
  </mat-grid-tile-header>
  
  Tile content
  
  <mat-grid-tile-footer>
    <span>Footer text</span>
    <mat-icon>info</mat-icon>
  </mat-grid-tile-footer>
</mat-grid-tile>
```

## Dynamic Grid

```html
<mat-grid-list [cols]="breakpointCols">
  @for (tile of tiles; track tile.id) {
    <mat-grid-tile [colspan]="tile.cols" [rowspan]="tile.rows">
      {{tile.text}}
    </mat-grid-tile>
  }
</mat-grid-list>
```

```ts
tiles = [
  {id: 1, text: 'One', cols: 3, rows: 1},
  {id: 2, text: 'Two', cols: 1, rows: 2},
  {id: 3, text: 'Three', cols: 1, rows: 1},
  {id: 4, text: 'Four', cols: 2, rows: 1}
];
```

## Responsive Grid

```ts
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({...})
export class ResponsiveGrid {
  cols = signal(4);
  breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.cols.set(1);
      } else if (result.breakpoints[Breakpoints.Small]) {
        this.cols.set(2);
      } else if (result.breakpoints[Breakpoints.Medium]) {
        this.cols.set(3);
      } else {
        this.cols.set(4);
      }
    });
  }
}
```

## Image Gallery Example

```html
<mat-grid-list cols="3" rowHeight="1:1" gutterSize="8px">
  @for (image of images; track image.id) {
    <mat-grid-tile>
      <img [src]="image.url" [alt]="image.title">
      <mat-grid-tile-footer>
        {{image.title}}
      </mat-grid-tile-footer>
    </mat-grid-tile>
  }
</mat-grid-list>
```

```scss
mat-grid-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## Dashboard Example

```html
<mat-grid-list cols="4" rowHeight="200px">
  <mat-grid-tile colspan="2" rowspan="2">
    <mat-grid-tile-header>Main Chart</mat-grid-tile-header>
    <chart-component />
  </mat-grid-tile>
  
  <mat-grid-tile>
    <mat-grid-tile-header>Metric 1</mat-grid-tile-header>
    <span class="big-number">42</span>
  </mat-grid-tile>
  
  <mat-grid-tile>
    <mat-grid-tile-header>Metric 2</mat-grid-tile-header>
    <span class="big-number">128</span>
  </mat-grid-tile>
</mat-grid-list>
```

## Accessibility

Grid list is decorative by default. Add roles based on usage:

```html
<!-- List of items -->
<mat-grid-list role="list" cols="3">
  <mat-grid-tile role="listitem">Item 1</mat-grid-tile>
  <mat-grid-tile role="listitem">Item 2</mat-grid-tile>
</mat-grid-list>
```

For interactive tiles, add appropriate keyboard handling:

```html
<mat-grid-tile tabindex="0" (keydown.enter)="selectTile(tile)">
```

## Key Points

- `cols` is required - sets number of columns
- Row height: fixed (`100px`), ratio (`4:3`), or `fit`
- Default row height is `1:1` (square)
- `colspan` and `rowspan` for spanning tiles
- `mat-grid-tile-header/footer` for overlays
- Combine with `BreakpointObserver` for responsive grids
- Add `role` attributes for semantic meaning

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/grid-list/grid-list.md
- https://material.angular.dev/components/grid-list/overview
-->
