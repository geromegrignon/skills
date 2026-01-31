---
name: component-stepper
description: Wizard-like workflows with step-by-step navigation
---

# Stepper

## Imports

```ts
import { MatStepperModule, MatStepper, STEPPER_GLOBAL_OPTIONS, MatStepperIntl } from '@angular/material/stepper';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';

// For responsive steppers
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
```

Multi-step wizard workflow component.

## Basic Usage

```html
<mat-stepper>
  <mat-step label="Personal Info">
    <p>Enter your personal information</p>
    <button mat-button matStepperNext>Next</button>
  </mat-step>
  <mat-step label="Address">
    <p>Enter your address</p>
    <button mat-button matStepperPrevious>Back</button>
    <button mat-button matStepperNext>Next</button>
  </mat-step>
  <mat-step label="Confirm">
    <p>Review and confirm</p>
    <button mat-button matStepperPrevious>Back</button>
    <button mat-button>Submit</button>
  </mat-step>
</mat-stepper>
```

## Orientation

```html
<!-- Horizontal (default) -->
<mat-stepper orientation="horizontal">

<!-- Vertical -->
<mat-stepper orientation="vertical">
```

## Linear Stepper

Requires completing previous steps:

```html
<mat-stepper linear>
  <mat-step [stepControl]="firstFormGroup">
    <form [formGroup]="firstFormGroup">
      <mat-form-field>
        <input matInput formControlName="name" required>
      </mat-form-field>
      <button mat-button matStepperNext type="button">Next</button>
    </form>
  </mat-step>
</mat-stepper>
```

```ts
firstFormGroup = new FormGroup({
  name: new FormControl('', Validators.required)
});
```

### Single Form Approach

```html
<form [formGroup]="form">
  <mat-stepper formArrayName="steps" linear>
    <mat-step formGroupName="0" [stepControl]="steps.get([0])">
      ...
      <button mat-button matStepperNext type="button">Next</button>
    </mat-step>
    <mat-step formGroupName="1" [stepControl]="steps.get([1])">
      ...
    </mat-step>
  </mat-stepper>
</form>
```

**Important:** Use `type="button"` on navigation buttons to prevent form submission.

## Custom Labels

```html
<mat-step>
  <ng-template matStepLabel>
    <mat-icon>person</mat-icon> Personal Info
  </ng-template>
  Step content
</mat-step>
```

### Label Position

```html
<mat-stepper labelPosition="bottom">
```

### Header Position

```html
<mat-stepper headerPosition="bottom">
```

## Step Types

### Optional Step

```html
<mat-step optional>
  <ng-template matStepLabel>Optional Step</ng-template>
</mat-step>
```

### Non-Editable Step

Prevent returning to completed step:

```html
<mat-step [editable]="false">
```

### Manually Completed

Override automatic completion logic:

```html
<mat-step [completed]="isStepComplete">
```

## Error Handling

Show errors on invalid steps:

```ts
providers: [
  {
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: {showError: true}
  }
]
```

```html
<mat-step [stepControl]="form" errorMessage="Please fill required fields">
```

## Custom Icons

```html
<mat-stepper>
  <ng-template matStepperIcon="edit">
    <mat-icon>create</mat-icon>
  </ng-template>
  <ng-template matStepperIcon="done">
    <mat-icon>check_circle</mat-icon>
  </ng-template>
  <ng-template matStepperIcon="number" let-index="index">
    {{index + 1}}
  </ng-template>
  ...
</mat-stepper>
```

## Custom Step States

```html
<mat-step [state]="isValid ? 'done' : 'error'">
```

Define custom states:

```ts
providers: [
  {
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: {displayDefaultIndicatorType: false}
  }
]
```

```html
<mat-stepper>
  <ng-template matStepperIcon="phone">
    <mat-icon>phone</mat-icon>
  </ng-template>
  
  <mat-step state="phone" label="Phone">...</mat-step>
</mat-stepper>
```

## Lazy Loading

Defer step content until opened:

```html
<mat-step>
  <ng-template matStepContent>
    <heavy-component />
  </ng-template>
</mat-step>
```

## Animation Duration

```html
<mat-stepper animationDuration="500ms">
```

Disable animation:

```html
<mat-stepper animationDuration="0ms">
```

## Responsive Stepper

```ts
@Component({...})
export class ResponsiveStepper {
  orientation = signal<StepperOrientation>('horizontal');

  breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.breakpointObserver.observe(Breakpoints.Handset)
      .subscribe(result => {
        this.orientation.set(result.matches ? 'vertical' : 'horizontal');
      });
  }
}
```

```html
<mat-stepper [orientation]="orientation">
```

## Programmatic Navigation

```ts
stepper = viewChild.required<MatStepper>(MatStepper);

goToStep(index: number): void {
  this.stepper().selectedIndex = index;
}

nextStep(): void {
  this.stepper().next();
}

previousStep(): void {
  this.stepper().previous();
}

reset(): void {
  this.stepper().reset();
}
```

## Events

```html
<mat-stepper (selectionChange)="onStepChange($event)">
```

```ts
onStepChange(event: StepperSelectionEvent): void {
  console.log('Previous:', event.previouslySelectedIndex);
  console.log('Current:', event.selectedIndex);
}
```

## Localization

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    {provide: MatStepperIntl, useClass: MyStepperIntl}
  ]
})
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Focus previous/next step header |
| `Enter` / `Space` | Select focused step |

## Accessibility

- Add `aria-label` or `aria-labelledby` to stepper and steps
- Prefer vertical steppers on small screens
- Use `<mat-error>` for form validation feedback
- Enable `showError` for non-linear steppers with errors

## Key Points

- `linear` enforces step completion order
- Use `stepControl` to tie validation to steps
- `type="button"` on nav buttons prevents form submission
- Steps are editable by default
- Lazy load heavy content with `matStepContent`
- Adapt orientation for responsive layouts
- Configure icons and states globally via `STEPPER_GLOBAL_OPTIONS`

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/stepper/stepper.md
- https://material.angular.dev/components/stepper/overview
-->
