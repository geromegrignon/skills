---
name: component-timepicker
description: Time selection with dropdown options
---

# Timepicker

## Imports

```ts
import { MatTimepickerModule, MAT_TIMEPICKER_CONFIG, MatTimepickerOption } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Uses same date adapters as datepicker
import { provideNativeDateAdapter, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
```

Time input with dropdown selection of predefined options.

## Basic Usage

```html
<mat-form-field>
  <mat-label>Pick a time</mat-label>
  <input matInput [matTimepicker]="picker">
  <mat-timepicker-toggle matSuffix [for]="picker" />
  <mat-timepicker #picker />
</mat-form-field>
```

## Standalone (Without Form Field)

```html
<input [matTimepicker]="picker">
<mat-timepicker-toggle [for]="picker" />
<mat-timepicker #picker />
```

## Forms Integration

```html
<mat-form-field>
  <mat-label>Meeting time</mat-label>
  <input matInput [matTimepicker]="picker" [formControl]="timeControl">
  <mat-timepicker-toggle matSuffix [for]="picker" />
  <mat-timepicker #picker />
</mat-form-field>
```

```ts
timeControl = new FormControl<Date | null>(null);
```

## Validation

### Min/Max Time

```html
<input matInput 
       [matTimepicker]="picker"
       matTimepickerMin="09:00"
       matTimepickerMax="17:00">
```

### Validation Errors

| Error | Cause |
|-------|-------|
| `matTimepickerParse` | Invalid time string |
| `matTimepickerMin` | Before minimum time |
| `matTimepickerMax` | After maximum time |

```html
@if (timeControl.hasError('matTimepickerMin')) {
  <mat-error>Time too early</mat-error>
}
```

## Interval Options

Default interval is 30 minutes.

```html
<!-- 15 minute intervals -->
<mat-timepicker interval="15m" />

<!-- 1 hour intervals -->
<mat-timepicker interval="1h" />

<!-- 90 minute intervals -->
<mat-timepicker interval="90 minutes" />
```

### Interval Format

- Number only: interpreted as minutes (`interval="30"`)
- Short units: `30m`, `1h`, `90s`
- Long units: `30 minutes`, `1 hour`, `90 seconds`

### Global Default Interval

```ts
providers: [
  {
    provide: MAT_TIMEPICKER_CONFIG,
    useValue: {interval: '15 minutes'}
  }
]
```

## Custom Options

```html
<mat-timepicker [options]="timeOptions" />
```

```ts
import {MatTimepickerOption} from '@angular/material/timepicker';

timeOptions: MatTimepickerOption[] = [
  {value: new Date(2024, 0, 1, 9, 0), label: '9:00 AM - Morning'},
  {value: new Date(2024, 0, 1, 12, 0), label: '12:00 PM - Noon'},
  {value: new Date(2024, 0, 1, 17, 0), label: '5:00 PM - End of Day'}
];
```

## Integration with Datepicker

Combined date and time selection:

```html
<mat-form-field>
  <mat-label>Appointment</mat-label>
  <input matInput 
         [matDatepicker]="datepicker" 
         [matTimepicker]="timepicker"
         [formControl]="dateTimeControl">
  <mat-datepicker-toggle matSuffix [for]="datepicker" />
  <mat-datepicker #datepicker />
  <mat-timepicker-toggle matSuffix [for]="timepicker" />
  <mat-timepicker #timepicker />
</mat-form-field>
```

Both components modify the same Date object - datepicker sets date, timepicker sets time.

## Custom Toggle Icon

```html
<mat-timepicker-toggle [for]="picker">
  <mat-icon matTimepickerToggleIcon>schedule</mat-icon>
</mat-timepicker-toggle>
```

## Date Adapters

Uses same adapters as datepicker:

| Adapter | Type |
|---------|------|
| `provideNativeDateAdapter` | Native `Date` |
| `provideDateFnsAdapter` | date-fns `Date` |
| `provideLuxonDateAdapter` | Luxon `DateTime` |
| `provideMomentDateAdapter` | Moment.js `Moment` |

**Note:** Native adapter only supports AM/PM and 24-hour formats.

## Localization

```ts
providers: [
  {provide: MAT_DATE_LOCALE, useValue: 'de-DE'}
]
```

Runtime change:

```ts
adapter = inject(DateAdapter<Date>);

setFrench(): void {
  this.adapter().setLocale('fr-FR');
}
```

## Custom Formats

```ts
const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
    timeInput: 'HH:mm'
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    timeInput: 'HH:mm',
    timeOptionLabel: 'HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

providers: [
  provideNativeDateAdapter(MY_FORMATS)
]
```

## Accessibility

- Uses ARIA combobox pattern
- Input has `role="combobox"`
- Dropdown has `role="listbox"`
- Options have `role="option"`

```html
<mat-timepicker 
    ariaLabel="Select appointment time"
    #picker>
</mat-timepicker>
```

## Key Points

- Works like datepicker but for time portion
- Uses same date adapters as datepicker
- Default 30-minute intervals, configurable
- Can use custom options array
- Integrates with datepicker for datetime
- Min/max control both validation and dropdown options
- Native adapter limited to AM/PM and 24-hour formats

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/timepicker/timepicker.md
- https://material.angular.dev/components/timepicker/overview
-->
