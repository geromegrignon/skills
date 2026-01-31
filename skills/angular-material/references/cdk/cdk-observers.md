---
name: cdk-observers
description: Directives for observing DOM mutations using MutationObserver
---

# CDK Observers

## Imports

```ts
import { ObserversModule, CdkObserveContent, ContentObserver } from '@angular/cdk/observers';
```

Directives built on native MutationObserver for detecting content changes.

## cdkObserveContent

Emits when content inside an element changes.

### Basic Usage

```html
<div (cdkObserveContent)="onContentChange()">
  <ng-content></ng-content>
</div>
```

```ts
@Component({
  selector: 'my-container',
  template: `
    <div (cdkObserveContent)="contentChanged()">
      <ng-content></ng-content>
    </div>
  `
})
export class MyContainer {
  contentChanged() {
    console.log('Content was modified');
    this.recalculateLayout();
  }
}
```

### With Event Data

```html
<div (cdkObserveContent)="onContentChange($event)">
  {{ dynamicText }}
</div>
```

```ts
onContentChange(mutations: MutationRecord[]) {
  console.log('Mutations:', mutations);
  mutations.forEach(mutation => {
    console.log('Type:', mutation.type);
    console.log('Added nodes:', mutation.addedNodes.length);
    console.log('Removed nodes:', mutation.removedNodes.length);
  });
}
```

### Debounced Observation

```html
<div 
  (cdkObserveContent)="onContentChange()"
  [debounce]="100">
  {{ rapidlyChangingContent }}
</div>
```

### Disabled State

```html
<div 
  (cdkObserveContent)="onContentChange()"
  [disabled]="observerDisabled">
  <ng-content></ng-content>
</div>
```

## ContentObserver Service

For programmatic usage:

```ts
import { ContentObserver } from '@angular/cdk/observers';

@Component({...})
export class MyComponent implements OnDestroy {
  private contentObserver = inject(ContentObserver);
  private subscription: Subscription;

  ngAfterViewInit() {
    this.subscription = this.contentObserver
      .observe(this.elementRef)
      .subscribe(mutations => {
        this.handleMutations(mutations);
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
```

## Use Cases

### Auto-resize Container

```ts
@Component({
  selector: 'auto-resize-container',
  template: `
    <div 
      #container
      (cdkObserveContent)="updateSize()">
      <ng-content></ng-content>
    </div>
  `
})
export class AutoResizeContainer {
  @ViewChild('container') container: ElementRef;

  updateSize() {
    const height = this.container.nativeElement.scrollHeight;
    // Adjust container size based on content
  }
}
```

### Projected Content Detection

```ts
@Component({
  selector: 'card-with-actions',
  template: `
    <div class="card">
      <div class="content">
        <ng-content></ng-content>
      </div>
      <div 
        class="actions" 
        [class.has-actions]="hasActions"
        (cdkObserveContent)="checkForActions()">
        <ng-content select="[card-actions]"></ng-content>
      </div>
    </div>
  `
})
export class CardWithActions {
  @ViewChild('actionsContainer') actionsContainer: ElementRef;
  hasActions = false;

  checkForActions() {
    this.hasActions = this.actionsContainer.nativeElement.children.length > 0;
  }
}
```

### Dynamic Text Truncation

```ts
@Component({
  selector: 'truncate-text',
  template: `
    <div 
      #textContainer
      (cdkObserveContent)="checkTruncation()">
      <ng-content></ng-content>
    </div>
    @if (isTruncated()) {
      <button (click)="expand()">Show more</button>
    }
  `
})
export class TruncateText {
  textContainer = viewChild.required<ElementRef<HTMLElement>>(ElementRef);
  isTruncated = signal<boolean>(false);

  checkTruncation(): void {
    const el = this.textContainer().nativeElement;
    this.isTruncated.set(el.scrollHeight > el.clientHeight);
  }
}
```

## Inputs

| Input | Type | Description |
|-------|------|-------------|
| `debounce` | `number` | Debounce time in ms before emitting |
| `disabled` | `boolean` | Disable observation |

## Output

| Output | Type | Description |
|--------|------|-------------|
| `cdkObserveContent` | `EventEmitter<MutationRecord[]>` | Emits on content change |

## Performance Considerations

- Use `debounce` for frequently changing content
- Disable when observation not needed
- Unsubscribe in `ngOnDestroy` for service usage
- Avoid observing large DOM trees

## Key Points

- `cdkObserveContent` directive for template usage
- `ContentObserver` service for programmatic usage
- Built on native `MutationObserver`
- `debounce` input for rate limiting
- `disabled` input to pause observation
- Emits `MutationRecord[]` with change details

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/observers/observers.md
- https://material.angular.dev/cdk/observers/overview
-->
