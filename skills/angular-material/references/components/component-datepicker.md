---
name: component-datepicker
description: Date and date range pickers with validation and internationalization
---

# Datepicker

## Imports

```ts
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Date adapters (choose one)
import { provideNativeDateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

// For programmatic access
import { DateAdapter, MatDatepicker } from '@angular/material/datepicker';
```

Date input with calendar popup for date selection.

## Basic Setup

Requires a date adapter:

```ts
import {provideNativeDateAdapter} from '@angular/material/core';

bootstrapApplication(App, {
  providers: [provideNativeDateAdapter()]
});
```

## Basic Datepicker

```html
<mat-form-field>
  <mat-label>Choose a date</mat-label>
  <input matInput [matDatepicker]="picker">
  <mat-datepicker-toggle matSuffix [for]="picker" />
  <mat-datepicker #picker />
</mat-form-field>
```

## Date Range Picker

```html
<mat-form-field>
  <mat-label>Trip dates</mat-label>
  <mat-date-range-input [rangePicker]="rangePicker">
    <input matStartDate placeholder="Start" [(ngModel)]="startDate">
    <input matEndDate placeholder="End" [(ngModel)]="endDate">
  </mat-date-range-input>
  <mat-datepicker-toggle matSuffix [for]="rangePicker" />
  <mat-date-range-picker #rangePicker />
</mat-form-field>
```

### With FormGroup

```ts
range = new FormGroup({
  start: new FormControl<Date | null>(null),
  end: new FormControl<Date | null>(null),
});
```

```html
<mat-date-range-input [formGroup]="range" [rangePicker]="picker">
  <input matStartDate formControlName="start">
  <input matEndDate formControlName="end">
</mat-date-range-input>
```

## Date Validation

### Min/Max Dates

```html
<input matInput [matDatepicker]="picker" [min]="minDate" [max]="maxDate">
```

```ts
minDate = new Date(2020, 0, 1);
maxDate = new Date(2025, 11, 31);
```

### Custom Filter

```html
<input matInput [matDatepicker]="picker" [matDatepickerFilter]="weekdaysOnly">
```

```ts
weekdaysOnly = (date: Date): boolean => {
  const day = date.getDay();
  return day !== 0 && day !== 6; // No weekends
};
```

### Validation Errors

| Error | Cause |
|-------|-------|
| `matDatepickerMin` | Date before `min` |
| `matDatepickerMax` | Date after `max` |
| `matDatepickerFilter` | Filtered out date |

## Events

```html
<input matInput [matDatepicker]="picker"
       (dateInput)="onInput($event)"
       (dateChange)="onChange($event)">
```

- `dateInput`: Fires on typing or calendar selection
- `dateChange`: Fires on blur or calendar selection complete

## Starting View

```html
<mat-datepicker #picker startView="year" />
```

Options: `month` (default), `year`, `multi-year`

### Start At Specific Date

```html
<mat-datepicker #picker [startAt]="startAt" />
```

## Confirmation Buttons

Require explicit confirmation:

```html
<mat-datepicker #picker>
  <mat-datepicker-actions>
    <button mat-button matDatepickerCancel>Cancel</button>
    <button mat-raised-button matDatepickerApply>Apply</button>
  </mat-datepicker-actions>
</mat-datepicker>
```

## Touch UI Mode

Better for mobile:

```html
<mat-datepicker #picker touchUi />
```

## Inline Calendar

No popup, embedded calendar:

```html
<mat-calendar [(selected)]="selectedDate" />
```

## Date Adapters

| Adapter | Date Type | Install |
|---------|-----------|---------|
| `provideNativeDateAdapter` | `Date` | Built-in |
| `provideDateFnsAdapter` | `Date` | `ng add @angular/material-date-fns-adapter` |
| `provideLuxonDateAdapter` | `DateTime` | `ng add @angular/material-luxon-adapter` |
| `provideMomentDateAdapter` | `Moment` | `ng add @angular/material-moment-adapter` |

### Luxon with UTC

```ts
provideLuxonDateAdapter(undefined, {useUtc: true})
```

## Custom Date Formats

```ts
const MY_DATE_FORMATS = {
  parse: {dateInput: 'DD/MM/YYYY'},
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

providers: [provideNativeDateAdapter(MY_DATE_FORMATS)]
```

## Localization

```ts
providers: [{provide: MAT_DATE_LOCALE, useValue: 'fr-FR'}]
```

Runtime change:

```ts
constructor(private adapter: DateAdapter<Date>) {}

setFrench() {
  this.adapter.setLocale('fr-FR');
}
```

## Highlighting Dates

```html
<mat-datepicker #picker [dateClass]="dateClass" />
```

```ts
dateClass = (date: Date) => {
  return this.isHoliday(date) ? 'holiday-date' : '';
};
```

## Custom Calendar Header

```html
<mat-datepicker #picker [calendarHeaderComponent]="CustomHeader" />
```

## Programmatic Control

```ts
picker = viewChild.required<MatDatepicker<Date>>(MatDatepicker);

openPicker(): void {
  this.picker().open();
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Alt + ↓` | Open datepicker |
| `Escape` | Close datepicker |
| `←` / `→` | Previous/next day |
| `↑` / `↓` | Previous/next week |
| `Home` / `End` | First/last day of month |
| `Page Up/Down` | Previous/next month |
| `Alt + Page Up/Down` | Previous/next year |
| `Enter` | Select date |

## Key Points

- Must provide a DateAdapter (native, Luxon, date-fns, Moment)
- Use `mat-date-range-input` for date range selection
- Always include `mat-datepicker-toggle` for mobile accessibility
- Enable confirmation buttons for better UX
- `touchUi` mode recommended for mobile
- Custom `dateClass` for highlighting special dates
- Native Date adapter has limited locale support

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/datepicker/datepicker.md
- https://material.angular.dev/components/datepicker/overview
-->
