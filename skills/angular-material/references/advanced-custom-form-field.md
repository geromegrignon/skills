---
name: advanced-custom-form-field
description: Creating custom form field controls that work with mat-form-field
---

# Custom Form Field Control

## Imports

```ts
import { MatFormFieldModule, MatFormFieldControl, MatFormField } from '@angular/material/form-field';
import { ControlValueAccessor, NgControl, FormGroup, FormBuilder } from '@angular/forms';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
```

Create custom components that work inside `<mat-form-field>` with full support for labels, hints, errors, and prefixes/suffixes.

## Implement MatFormFieldControl

```ts
import {MatFormFieldControl} from '@angular/material/form-field';

@Component({
  selector: 'my-tel-input',
  providers: [{provide: MatFormFieldControl, useExisting: MyTelInput}],
  template: `...`
})
export class MyTelInput implements MatFormFieldControl<MyTel> {
  // Implementation below...
}
```

## Required Properties

### value

The control's current value:

```ts
@Input()
get value(): MyTel | null {
  return this._value;
}
set value(val: MyTel | null) {
  this._value = val;
  this.stateChanges.next();
}
private _value: MyTel | null = null;
```

### stateChanges

Observable that emits when state changes (form field listens to this):

```ts
stateChanges = new Subject<void>();

ngOnDestroy() {
  this.stateChanges.complete();
}
```

### id

Unique ID for label association:

```ts
static nextId = 0;
@HostBinding() id = `my-tel-input-${MyTelInput.nextId++}`;
```

### placeholder

```ts
@Input()
get placeholder() { return this._placeholder; }
set placeholder(plh) {
  this._placeholder = plh;
  this.stateChanges.next();
}
private _placeholder: string;
```

### ngControl

Reference to the NgControl (for form integration):

```ts
constructor(@Optional() @Self() public ngControl: NgControl) {
  if (this.ngControl != null) {
    this.ngControl.valueAccessor = this;
  }
}
```

### focused

Whether the control is focused:

```ts
focused = false;

onFocusIn() {
  if (!this.focused) {
    this.focused = true;
    this.stateChanges.next();
  }
}

onFocusOut(event: FocusEvent) {
  if (!this.elementRef.nativeElement.contains(event.relatedTarget)) {
    this.focused = false;
    this.stateChanges.next();
  }
}
```

### empty

Whether the control has no value:

```ts
get empty(): boolean {
  return !this.value || !this.value.hasContent();
}
```

### shouldLabelFloat

Whether the label should float:

```ts
@HostBinding('class.floating')
get shouldLabelFloat(): boolean {
  return this.focused || !this.empty;
}
```

### required

```ts
@Input()
get required(): boolean { return this._required; }
set required(req: BooleanInput) {
  this._required = coerceBooleanProperty(req);
  this.stateChanges.next();
}
private _required = false;
```

### disabled

```ts
@Input()
get disabled(): boolean { return this._disabled; }
set disabled(value: BooleanInput) {
  this._disabled = coerceBooleanProperty(value);
  this.stateChanges.next();
}
private _disabled = false;
```

### errorState

Whether the control is in an error state:

```ts
errorState = false;

ngDoCheck() {
  if (this.ngControl) {
    this.updateErrorState();
  }
}

private updateErrorState() {
  const parent = this.parentForm || this.parentFormGroup;
  const newState = (this.ngControl?.invalid || this.invalid) && 
                   (this.touched || parent?.submitted);
  
  if (this.errorState !== newState) {
    this.errorState = newState;
    this.stateChanges.next();
  }
}
```

### controlType

Unique identifier for CSS targeting:

```ts
controlType = 'my-tel-input';
// Results in class: mat-form-field-type-my-tel-input
```

## Required Methods

### setDescribedByIds

Handle aria-describedby for hints/errors:

```ts
@Input('aria-describedby') userAriaDescribedBy: string;

setDescribedByIds(ids: string[]) {
  const container = this.elementRef.nativeElement.querySelector('.input-container');
  container.setAttribute('aria-describedby', ids.join(' '));
}
```

### onContainerClick

Handle clicks on the form field container:

```ts
onContainerClick(event: MouseEvent) {
  if ((event.target as Element).tagName.toLowerCase() !== 'input') {
    this.elementRef.nativeElement.querySelector('input')?.focus();
  }
}
```

## ControlValueAccessor Integration

Implement for form integration:

```ts
export class MyTelInput implements MatFormFieldControl<MyTel>, ControlValueAccessor {
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(val: MyTel): void {
    this.value = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
```

## Accessibility

Link to the form field's label:

```ts
constructor(@Optional() public parentFormField: MatFormField) {}
```

```html
<div role="group"
     [attr.aria-labelledby]="parentFormField?.getLabelId()"
     [attr.aria-describedby]="describedBy">
  <input ...>
</div>
```

## Complete Example

```ts
@Component({
  selector: 'my-tel-input',
  template: `
    <div role="group" [formGroup]="parts"
         [attr.aria-labelledby]="parentFormField?.getLabelId()">
      <input formControlName="area" size="3" (focusin)="onFocusIn()" (focusout)="onFocusOut($event)">
      <span>-</span>
      <input formControlName="exchange" size="3" (focusin)="onFocusIn()" (focusout)="onFocusOut($event)">
      <span>-</span>
      <input formControlName="subscriber" size="4" (focusin)="onFocusIn()" (focusout)="onFocusOut($event)">
    </div>
  `,
  providers: [{provide: MatFormFieldControl, useExisting: MyTelInput}]
})
export class MyTelInput implements MatFormFieldControl<MyTel>, ControlValueAccessor {
  static nextId = 0;
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'my-tel-input';
  errorState = false;
  
  @HostBinding() id = `my-tel-input-${MyTelInput.nextId++}`;
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() disabled: boolean;
  
  parts: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private elementRef: ElementRef,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() public parentFormField: MatFormField
  ) {
    this.parts = fb.group({area: '', exchange: '', subscriber: ''});
    if (ngControl) ngControl.valueAccessor = this;
  }
  
  get value(): MyTel | null {
    const {area, exchange, subscriber} = this.parts.value;
    return area && exchange && subscriber ? new MyTel(area, exchange, subscriber) : null;
  }
  
  set value(tel: MyTel | null) {
    this.parts.setValue({
      area: tel?.area || '',
      exchange: tel?.exchange || '',
      subscriber: tel?.subscriber || ''
    });
    this.stateChanges.next();
  }
  
  get empty() { return !this.parts.value.area && !this.parts.value.exchange && !this.parts.value.subscriber; }
  get shouldLabelFloat() { return this.focused || !this.empty; }
  
  // ... implement remaining required methods
}
```

## Usage

```html
<mat-form-field>
  <mat-label>Phone</mat-label>
  <my-tel-input placeholder="555-555-5555" required />
  <mat-icon matPrefix>phone</mat-icon>
  <mat-hint>Include area code</mat-hint>
  <mat-error>Phone is required</mat-error>
</mat-form-field>
```

## Key Points

- Provide `MatFormFieldControl` in component providers
- Emit on `stateChanges` whenever any state changes
- Implement `ControlValueAccessor` for form integration
- Set `ngControl.valueAccessor = this` in constructor (avoid circular dependency)
- Use `ngDoCheck` for error state since some triggers aren't subscribable
- Link `aria-labelledby` to `parentFormField.getLabelId()` for accessibility

<!--
Source references:
- https://github.com/angular/components/blob/main/guides/creating-a-custom-form-field-control.md
- https://material.angular.dev/guide/creating-a-custom-form-field-control
-->
