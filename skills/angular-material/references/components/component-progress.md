---
name: component-progress
description: Progress indicators including progress bar and spinner
---

# Progress Indicators

## Imports

```ts
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
```

Visual indicators for ongoing operations.

## Progress Bar

Horizontal bar showing progress or activity.

### Determinate (Default)

Shows specific progress percentage:

```html
<mat-progress-bar mode="determinate" [value]="progress" />
```

```ts
progress = signal(0);

startProgress(): void {
  const interval = setInterval(() => {
    this.progress.set(this.progress() + 10);
    if (this.progress() >= 100) {
      clearInterval(interval);
    }
  }, 500);
}
```

### Indeterminate

Unknown duration:

```html
<mat-progress-bar mode="indeterminate" />
```

### Buffer

Shows loading and buffering:

```html
<mat-progress-bar 
    mode="buffer" 
    [value]="loadProgress" 
    [bufferValue]="bufferProgress">
</mat-progress-bar>
```

```ts
loadProgress = 30;   // Primary bar
bufferProgress = 50; // Buffer bar
```

### Query

Pre-loading indicator:

```html
<mat-progress-bar mode="query" />
```

Switch to determinate once progress is known:

```ts
mode = signal('query');
value = signal(0);

onProgressAvailable(): void {
  this.mode.set('determinate');
  this.value.set(actualProgress);
}
```

---

## Progress Spinner

Circular progress indicator.

### Determinate

```html
<mat-progress-spinner 
    mode="determinate" 
    [value]="progress" />
```

### Indeterminate

```html
<mat-progress-spinner mode="indeterminate" />

<!-- Or use the alias -->
<mat-spinner />
```

### Custom Diameter

```html
<mat-spinner diameter="20" />
<mat-spinner diameter="50" />
<mat-spinner diameter="100" />
```

### Custom Stroke Width

```html
<mat-spinner strokeWidth="2" />
<mat-spinner strokeWidth="8" />
```

---

## Common Patterns

### Loading Button

```html
<button mat-raised-button [disabled]="isLoading()" (click)="submit()">
  @if (isLoading()) {
    <mat-spinner diameter="20" />
  } @else {
    Submit
  }
</button>
```

### Page Loading Overlay

```html
@if (isLoading()) {
  <div class="loading-overlay">
    <mat-spinner />
  </div>
}
```

```scss
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}
```

### File Upload Progress

```html
<div class="upload-item">
  <span>{{ file().name }}</span>
  <mat-progress-bar 
      mode="determinate" 
      [value]="file().progress" />
  <span>{{ file().progress }}%</span>
</div>
```

### Inline Loading

```html
<span>
  Loading data
  <mat-spinner diameter="16" class="inline-spinner" />
</span>
```

```scss
.inline-spinner {
  display: inline-block;
  vertical-align: middle;
  margin-left: 8px;
}
```

---

## Theming

```html
<mat-progress-bar color="primary" mode="indeterminate" />
<mat-progress-bar color="accent" mode="indeterminate" />
<mat-progress-bar color="warn" mode="indeterminate" />

<mat-spinner color="primary" />
<mat-spinner color="accent" />
<mat-spinner color="warn" />
```

---

## Accessibility

Always provide labels:

```html
<mat-progress-bar 
    mode="determinate" 
    [value]="progress"
    aria-label="File upload progress" />

<mat-progress-spinner 
    mode="indeterminate"
    aria-label="Loading content" />
```

- Progress bar uses `role="progressbar"`
- Default `aria-valuemin="0"` and `aria-valuemax="100"`
- Don't change these default values

## Key Points

- Progress bar modes: `determinate`, `indeterminate`, `buffer`, `query`
- Spinner modes: `determinate`, `indeterminate`
- `mat-spinner` is alias for `<mat-progress-spinner mode="indeterminate">`
- Use `diameter` and `strokeWidth` to size spinners
- Always provide `aria-label` for accessibility
- Buffer mode shows primary progress and buffer amount

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/progress-bar/progress-bar.md
- https://github.com/angular/components/blob/main/src/material/progress-spinner/progress-spinner.md
-->
