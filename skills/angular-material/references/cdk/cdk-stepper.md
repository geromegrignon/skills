---
name: cdk-stepper
description: Foundation for building custom stepper/wizard components
---

# CDK Stepper

## Imports

```ts
import { CdkStepperModule, CdkStepper, CdkStep, CdkStepLabel, CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
```

Base classes for building custom stepper/wizard workflows.

## Basic Structure

```ts
import { CdkStepper, CdkStep } from '@angular/cdk/stepper';

@Component({
  selector: 'my-stepper',
  template: `
    <div class="step-headers">
      @for (step of steps; track step; let i = $index) {
        <button 
          [class.active]="selectedIndex === i"
          (click)="selectedIndex = i">
          Step {{ i + 1 }}
        </button>
      }
    </div>
    <div class="step-content">
      <ng-container [ngTemplateOutlet]="selected?.content"></ng-container>
    </div>
  `,
  providers: [{ provide: CdkStepper, useExisting: MyStepper }]
})
export class MyStepper extends CdkStepper {}
```

## Usage

```html
<my-stepper>
  <cdk-step>
    <ng-template cdkStepLabel>Personal Info</ng-template>
    <form>
      <input placeholder="Name">
      <button cdkStepperNext>Next</button>
    </form>
  </cdk-step>
  
  <cdk-step>
    <ng-template cdkStepLabel>Address</ng-template>
    <form>
      <input placeholder="Street">
      <button cdkStepperPrevious>Back</button>
      <button cdkStepperNext>Next</button>
    </form>
  </cdk-step>
  
  <cdk-step>
    <ng-template cdkStepLabel>Confirm</ng-template>
    <p>Review your information</p>
    <button cdkStepperPrevious>Back</button>
    <button (click)="submit()">Submit</button>
  </cdk-step>
</my-stepper>
```

## Linear Stepper

Requires completing previous steps:

```html
<my-stepper linear>
  <cdk-step [stepControl]="firstFormGroup">
    <form [formGroup]="firstFormGroup">
      <input formControlName="name" required>
      <button cdkStepperNext>Next</button>
    </form>
  </cdk-step>
  
  <cdk-step [stepControl]="secondFormGroup">
    <form [formGroup]="secondFormGroup">
      <input formControlName="email" required>
      <button cdkStepperPrevious>Back</button>
      <button cdkStepperNext>Next</button>
    </form>
  </cdk-step>
</my-stepper>
```

```ts
@Component({...})
export class MyComponent {
  firstFormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });
  
  secondFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
}
```

## Step Types

### Optional Step

```html
<cdk-step [optional]="true">
  <ng-template cdkStepLabel>Optional Info</ng-template>
  <!-- Can be skipped in linear stepper -->
</cdk-step>
```

### Non-Editable Step

```html
<cdk-step [editable]="false">
  <ng-template cdkStepLabel>Confirmation</ng-template>
  <!-- Cannot return to this step after leaving -->
</cdk-step>
```

### Completed Step

```html
<cdk-step [completed]="isStepComplete">
  <!-- Manually control completion -->
</cdk-step>
```

## Navigation Buttons

```html
<!-- Next button -->
<button cdkStepperNext>Next</button>

<!-- Previous button -->
<button cdkStepperPrevious>Back</button>
```

**Important:** In single-form steppers, set `type="button"` to prevent form submission:

```html
<form [formGroup]="form">
  <my-stepper>
    <cdk-step>
      <input formControlName="field1">
      <button type="button" cdkStepperNext>Next</button>
    </cdk-step>
    <cdk-step>
      <input formControlName="field2">
      <button type="button" cdkStepperPrevious>Back</button>
      <button type="submit">Submit</button>
    </cdk-step>
  </my-stepper>
</form>
```

## CdkStepper API

```ts
class CdkStepper {
  // Properties
  steps: QueryList<CdkStep>;        // All steps
  selected: CdkStep;                // Current step
  selectedIndex: number;            // Current step index
  linear: boolean;                  // Require sequential completion

  // Methods
  next(): void;                     // Go to next step
  previous(): void;                 // Go to previous step
  reset(): void;                    // Reset stepper to first step
}
```

## CdkStep API

```ts
class CdkStep {
  // Inputs
  stepControl: AbstractControl;     // Form control for validation
  label: string;                    // Step label text
  editable: boolean;                // Can return to step (default: true)
  optional: boolean;                // Can skip in linear mode
  completed: boolean;               // Step completion state

  // Template
  content: TemplateRef<any>;        // Step content template

  // Selection
  select(): void;                   // Select this step
  reset(): void;                    // Reset step state
}
```

## Custom Stepper Example

```ts
@Component({
  selector: 'custom-stepper',
  template: `
    <nav class="stepper-nav">
      @for (step of steps; track step; let i = $index) {
        <div 
          class="step-indicator"
          [class.active]="selectedIndex === i"
          [class.completed]="step.completed"
          [class.disabled]="linear && i > selectedIndex && !isStepComplete(i - 1)"
          (click)="selectStep(i)">
          <span class="step-number">{{ i + 1 }}</span>
          <span class="step-label">
            @if (step.stepLabel) {
              <ng-container *ngTemplateOutlet="step.stepLabel.template"></ng-container>
            } @else {
              {{ step.label }}
            }
          </span>
        </div>
      }
    </nav>
    
    <div class="step-content">
      <ng-container [ngTemplateOutlet]="selected?.content"></ng-container>
    </div>
  `,
  providers: [{ provide: CdkStepper, useExisting: CustomStepper }]
})
export class CustomStepper extends CdkStepper {
  selectStep(index: number): void {
    if (!this.linear || this.canNavigate(index)) {
      this.selectedIndex = index;
    }
  }

  canNavigate(index: number): boolean {
    // Allow navigating back or to completed steps
    return index <= this.selectedIndex || 
           this.steps.toArray().slice(0, index).every(s => s.completed);
  }

  isStepComplete(index: number): boolean {
    return this.steps.toArray()[index]?.completed ?? false;
  }
}
```

## Keyboard Interaction

| Key | Action |
|-----|--------|
| `←` | Focus previous step header |
| `→` | Focus next step header |
| `Enter` / `Space` | Select focused step |

## Accessibility

Recommended ARIA implementation:

```html
<div role="tablist">
  @for (step of steps; track step; let i = $index) {
    <button 
      role="tab"
      [attr.aria-selected]="selectedIndex === i"
      [attr.aria-controls]="'panel-' + i">
      Step {{ i + 1 }}
    </button>
  }
</div>

<div 
  role="tabpanel"
  [attr.id]="'panel-' + selectedIndex"
  [attr.aria-labelledby]="'step-' + selectedIndex">
  <ng-container [ngTemplateOutlet]="selected?.content"></ng-container>
</div>
```

## Key Points

- `CdkStepper` base class for custom steppers
- `CdkStep` for individual steps
- `linear` input enforces sequential completion
- `stepControl` connects to form validation
- `cdkStepperNext` / `cdkStepperPrevious` for navigation
- `optional` allows skipping steps in linear mode
- `editable` controls if users can return to step
- `reset()` returns stepper to initial state

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/stepper/stepper.md
- https://material.angular.dev/cdk/stepper/overview
-->
