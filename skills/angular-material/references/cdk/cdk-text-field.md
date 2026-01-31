---
name: cdk-text-field
description: CDK utilities for text inputs including auto-resize and autofill detection
---

# CDK Text Field

## Imports

```ts
import { TextFieldModule, CdkTextareaAutosize, CdkAutofill } from '@angular/cdk/text-field';
import { AutofillMonitor, AutofillEvent } from '@angular/cdk/text-field';
```

Utilities for working with text input fields.

## Auto-Resizing Textarea

```html
<textarea cdkTextareaAutosize></textarea>
```

### With Min/Max Rows

```html
<textarea 
    cdkTextareaAutosize
    cdkAutosizeMinRows="2"
    cdkAutosizeMaxRows="10">
</textarea>
```

### Programmatic Resize

```ts
autosize = viewChild.required<CdkTextareaAutosize>(CdkTextareaAutosize);

// Trigger resize (e.g., after content change)
triggerResize(): void {
  this.autosize().resizeToFitContent();
}

// Force resize even if content hasn't changed
forceResize(): void {
  this.autosize().resizeToFitContent(true);
}
```

### With Material Form Field

```html
<mat-form-field>
  <mat-label>Description</mat-label>
  <textarea matInput
            cdkTextareaAutosize
            cdkAutosizeMinRows="3"
            cdkAutosizeMaxRows="8">
  </textarea>
</mat-form-field>
```

---

## Autofill Detection

### Monitor Service

```ts
import {AutofillMonitor} from '@angular/cdk/text-field';

@Component({...})
export class App implements AfterViewInit, OnDestroy {
  emailInput = viewChild.required<ElementRef<HTMLInputElement>>('emailInput', {read: ElementRef});

  autofillMonitor = inject(AutofillMonitor);

  constructor() {
    afterNextRender(() => {
      this.autofillMonitor.monitor(this.emailInput())
      .subscribe(event => {
        if (event.isAutofilled) {
          console.log('Email was autofilled');
          // Maybe validate or show indicator
          }
        });
    });
  }
}
```

### Directive Approach

```html
<input #emailInput 
       (cdkAutofill)="onAutofill($event)">
```

```ts
onAutofill(event: AutofillEvent) {
  if (event.isAutofilled) {
    this.showAutofillIndicator = true;
  } else {
    this.showAutofillIndicator = false;
  }
}
```

---

## Autofill Styling

Browsers apply default styling to autofilled inputs. Override with mixin:

### Setup CSS

```scss
@use '@angular/cdk';

// Required for autofill monitoring to work
@include cdk.text-field-autofill();
```

### Custom Autofill Colors

```scss
@use '@angular/cdk';

// Custom autofill appearance
input.custom-input {
  @include cdk.text-field-autofill-color(transparent, black);
}

// Different colors for dark theme
.dark-theme input {
  @include cdk.text-field-autofill-color(#333, white);
}
```

Mixin signature:

```scss
@include cdk.text-field-autofill-color($background, $color);
```

---

## Common Patterns

### Growing Comment Box

```html
<mat-form-field class="full-width">
  <mat-label>Comment</mat-label>
  <textarea matInput
            cdkTextareaAutosize
            cdkAutosizeMinRows="1"
            cdkAutosizeMaxRows="5"
            placeholder="Add a comment...">
  </textarea>
</mat-form-field>
```

### Login Form with Autofill Detection

```html
<form>
  <mat-form-field>
    <mat-label>Email</mat-label>
    <input matInput 
           type="email"
           (cdkAutofill)="emailAutofilled = $event.isAutofilled">
    @if (emailAutofilled) {
      <mat-hint>Autofilled from browser</mat-hint>
    }
  </mat-form-field>

  <mat-form-field>
    <mat-label>Password</mat-label>
    <input matInput 
           type="password"
           (cdkAutofill)="passwordAutofilled = $event.isAutofilled">
  </mat-form-field>
</form>
```

### Resize After Async Content

```ts
autosize = viewChild.required<CdkTextareaAutosize>(CdkTextareaAutosize);

loadContent(): void {
  this.contentService.getContent().subscribe(content => {
    this.textContent = content;
    
    // Wait for view to update, then resize
    setTimeout(() => {
      this.autosize().resizeToFitContent(true);
    });
  });
}
```

---

## AutofillEvent Interface

```ts
interface AutofillEvent {
  target: Element;
  isAutofilled: boolean;
}
```

---

## Key Points

- `cdkTextareaAutosize`: auto-growing textarea
- `cdkAutosizeMinRows/cdkAutosizeMaxRows`: constrain growth
- `resizeToFitContent(force?)`: programmatic resize
- `AutofillMonitor`: detect browser autofill
- `cdkAutofill` directive: simpler autofill detection
- Include `cdk.text-field-autofill()` mixin for styling
- `text-field-autofill-color($bg, $color)`: customize autofill appearance

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/text-field/text-field.md
- https://material.angular.dev/cdk/text-field/overview
-->
