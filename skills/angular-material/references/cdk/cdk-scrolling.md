---
name: cdk-scrolling
description: CDK virtual scrolling for performant rendering of large lists
---

# CDK Scrolling

## Imports

```ts
import { ScrollingModule, CdkVirtualScrollViewport, CdkVirtualForOf } from '@angular/cdk/scrolling';
import { ScrollDispatcher, ViewportRuler, CdkScrollable } from '@angular/cdk/scrolling';
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
```

The scrolling package provides virtual scrolling for performant rendering of large lists and utilities for scroll detection.

## Virtual Scrolling Basics

Virtual scrolling renders only visible items, simulating a full list by matching container height to total content height.

```html
<cdk-virtual-scroll-viewport itemSize="50" class="viewport">
  <div *cdkVirtualFor="let item of items" class="item">
    {{item}}
  </div>
</cdk-virtual-scroll-viewport>
```

```scss
.viewport {
  height: 400px;
}

.item {
  height: 50px;
}
```

## cdkVirtualFor Directive

Drop-in replacement for `@for` inside virtual scroll viewport:

```html
<cdk-virtual-scroll-viewport itemSize="50">
  <div *cdkVirtualFor="let item of items; let i = index; trackBy: trackById">
    {{i}}: {{item.name}}
  </div>
</cdk-virtual-scroll-viewport>
```

### Context Variables

| Variable | Description |
|----------|-------------|
| `index` | Index in data source |
| `count` | Total items in data source |
| `first` | Is first item |
| `last` | Is last item |
| `even` | Index is even |
| `odd` | Index is odd |

### Data Sources

Accepts Array, Observable, or DataSource:

```ts
// Array
items = ['Item 1', 'Item 2', ...];

// Observable
items$ = this.http.get<Item[]>('/api/items');

// DataSource
class MyDataSource extends DataSource<Item> {
  connect(): Observable<Item[]> {
    return this.itemsSubject.asObservable();
  }
  disconnect() {}
}
```

## Fixed Size Strategy

For items of uniform height (best performance):

```html
<cdk-virtual-scroll-viewport itemSize="50" minBufferPx="100" maxBufferPx="250">
  ...
</cdk-virtual-scroll-viewport>
```

- `itemSize`: Fixed height of each item (required)
- `minBufferPx`: Minimum buffer before rendering more items
- `maxBufferPx`: Target buffer after render trigger

## View Recycling

Views are cached and reused for performance:

```html
<!-- Adjust cache size (default is reasonable, 0 disables) -->
<div *cdkVirtualFor="let item of items; templateCacheSize: 20">
```

## Horizontal Scrolling

```html
<cdk-virtual-scroll-viewport orientation="horizontal" itemSize="100">
  <div *cdkVirtualFor="let item of items" class="horizontal-item">
    {{item}}
  </div>
</cdk-virtual-scroll-viewport>
```

```scss
.cdk-virtual-scroll-content-wrapper {
  display: flex;
  flex-direction: row;
}

.horizontal-item {
  width: 100px;
}
```

## Append Only Mode

Don't remove items that scroll out of view (useful for complex items):

```html
<cdk-virtual-scroll-viewport itemSize="50" appendOnly>
  ...
</cdk-virtual-scroll-viewport>
```

## Parent Element Scrolling

Use a parent element as the scroll container:

```html
<div class="scrollable-container" cdkVirtualScrollingElement>
  <header>Fixed header</header>
  <cdk-virtual-scroll-viewport itemSize="50">
    <div *cdkVirtualFor="let item of items">{{item}}</div>
  </cdk-virtual-scroll-viewport>
</div>
```

## Window Scrolling

Use browser window as scroll container (good for mobile):

```html
<cdk-virtual-scroll-viewport itemSize="50" scrollWindow>
  <div *cdkVirtualFor="let item of items">{{item}}</div>
</cdk-virtual-scroll-viewport>
```

## Elements with Parent Tag Requirements

For `<tr>`, `<li>`, etc. with parent requirements:

```html
<cdk-virtual-scroll-viewport itemSize="48">
  <table>
    <tr *cdkVirtualFor="let row of dataSource">
      <td>{{row.name}}</td>
    </tr>
  </table>
</cdk-virtual-scroll-viewport>
```

## ScrollDispatcher & cdkScrollable

Register scrollable containers for scroll event coordination:

```html
<div class="scrollable-panel" cdkScrollable>
  <!-- Content -->
</div>
```

```ts
import {ScrollDispatcher} from '@angular/cdk/scrolling';

constructor(private scrollDispatcher: ScrollDispatcher) {}

ngOnInit() {
  this.scrollDispatcher.scrolled()
    .subscribe(() => this.onScroll());
}
```

## ViewportRuler

Measure browser viewport dimensions:

```ts
import {ViewportRuler} from '@angular/cdk/scrolling';

viewportRuler = inject(ViewportRuler);

getViewportSize(): void {
  const {width, height} = this.viewportRuler.getViewportSize();
  return {width, height};
}
```

## Custom Scroll Strategy

Provide via `VIRTUAL_SCROLL_STRATEGY` token:

```ts
@Component({
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useClass: MyCustomScrollStrategy
  }]
})
export class MyComponent {}
```

## Key Points

- `itemSize` is required for the default fixed-size strategy
- Virtual scrolling dramatically improves performance for 100+ items
- `trackBy` function receives the data source index, not rendered index
- Context variables reflect data source position, not viewport position
- Buffer parameters control when new items render during scroll
- Use `appendOnly` for complex items that are expensive to recreate
- `cdkScrollable` enables scroll coordination across the application

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/scrolling/scrolling.md
- https://material.angular.dev/cdk/scrolling/overview
-->
