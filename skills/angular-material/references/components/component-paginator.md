---
name: component-paginator
description: Pagination controls for navigating paged data
---

# Paginator

## Imports

```ts
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
```

Navigation controls for paged data, typically used with tables.

## Basic Usage

```html
<mat-paginator 
    [length]="100"
    [pageSize]="10"
    [pageSizeOptions]="[5, 10, 25, 100]"
    (page)="onPageChange($event)">
</mat-paginator>
```

```ts
onPageChange(event: PageEvent): void {
  console.log('Page index:', event.pageIndex);
  console.log('Page size:', event.pageSize);
  console.log('Total items:', event.length);
}
```

## Configuration

| Property | Description | Default |
|----------|-------------|---------|
| `length` | Total number of items | 0 |
| `pageSize` | Items per page | 50 |
| `pageIndex` | Current page (0-based) | 0 |
| `pageSizeOptions` | Page size dropdown options | [] |

## With Table

```html
<table mat-table [dataSource]="dataSource">
  <!-- columns -->
</table>

<mat-paginator 
    [length]="totalItems"
    [pageSize]="10"
    [pageSizeOptions]="[10, 25, 50]"
    (page)="loadPage($event)">
</mat-paginator>
```

```ts
loadPage(event: PageEvent): void {
  this.dataService.getPage(event.pageIndex, event.pageSize)
    .subscribe(data => {
      this.dataSource = data.items;
      this.totalItems = data.total;
    });
}
```

## With MatTableDataSource

Paginator integrates directly:

```ts
paginator = viewChild.required<MatPaginator>(MatPaginator);

constructor() {
  afterNextRender(() => {
    this.dataSource.paginator = this.paginator();
  });
}
```

```html
<table mat-table [dataSource]="dataSource">...</table>
<mat-paginator [pageSizeOptions]="[5, 10, 25]" />
```

## Hide Page Size

```html
<mat-paginator [hidePageSize]="true">
</mat-paginator>
```

## Show First/Last Buttons

```html
<mat-paginator 
    [showFirstLastButtons]="true"
    [length]="100"
    [pageSize]="10">
</mat-paginator>
```

## Disabled State

```html
<mat-paginator [disabled]="isLoading">
</mat-paginator>
```

## Programmatic Control

```ts
paginator = viewChild.required<MatPaginator>(MatPaginator);

goToFirstPage(): void {
  this.paginator().firstPage();
}

goToLastPage(): void {
  this.paginator().lastPage();
}

goToNextPage(): void {
  this.paginator().nextPage();
}

goToPreviousPage(): void {
  this.paginator().previousPage();
}

// Check navigation availability
canGoBack(): boolean {
  return this.paginator().hasPreviousPage();
}

canGoForward(): boolean {
  return this.paginator().hasNextPage();
}
```

## Custom Select Configuration

```html
<mat-paginator 
    [selectConfig]="{disableOptionCentering: true}">
</mat-paginator>
```

## Internationalization

Customize labels:

```ts
import {MatPaginatorIntl} from '@angular/material/paginator';

export class MyPaginatorIntl extends MatPaginatorIntl {
  itemsPerPageLabel = 'Éléments par page';
  nextPageLabel = 'Page suivante';
  previousPageLabel = 'Page précédente';
  firstPageLabel = 'Première page';
  lastPageLabel = 'Dernière page';

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 sur ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} – ${endIndex} sur ${length}`;
  };
}
```

```ts
providers: [
  {provide: MatPaginatorIntl, useClass: MyPaginatorIntl}
]
```

## Page Event

```ts
interface PageEvent {
  pageIndex: number;  // Current page index
  pageSize: number;   // Items per page
  length: number;     // Total items
  previousPageIndex?: number;  // Previous page
}
```

## Server-Side Pagination Example

```ts
@Component({...})
export class ServerPaginatedTable implements OnInit {
  dataSource = signal<User[]>([]);
  totalItems = signal(0);
  pageSize = 10;
  pageIndex = signal(0);

  constructor() {
    this.loadData();
  }

  loadData(): void {
    this.userService.getUsers(this.pageIndex, this.pageSize)
      .subscribe(response => {
        this.dataSource.set(response.users);
        this.totalItems.set(response.total);
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadData();
  }
}
```

## Accessibility

Always provide an `aria-label`:

```html
<mat-paginator 
    aria-label="Select page of search results"
    [length]="100"
    [pageSize]="10">
</mat-paginator>
```

Button labels can be customized in `MatPaginatorIntl`.

## Key Points

- `length`: total items being paginated
- `pageSize`: items per page
- `pageIndex`: current page (0-based)
- `pageSizeOptions`: dropdown options
- Use `(page)` event for server-side pagination
- Assign to `dataSource.paginator` for client-side
- `showFirstLastButtons` for jump navigation
- Customize labels via `MatPaginatorIntl`

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/paginator/paginator.md
- https://material.angular.dev/components/paginator/overview
-->
