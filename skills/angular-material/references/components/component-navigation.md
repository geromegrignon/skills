---
name: component-navigation
description: Navigation components including sidenav, menu, toolbar, and tabs
---

# Navigation Components

## Imports

```ts
// Sidenav/Drawer
import { MatSidenavModule, MatSidenav, MatDrawer } from '@angular/material/sidenav';

// Menu
import { MatMenuModule } from '@angular/material/menu';

// Toolbar
import { MatToolbarModule } from '@angular/material/toolbar';

// Tabs
import { MatTabsModule } from '@angular/material/tabs';
```

## Sidenav

Collapsible side content for fullscreen apps.

### Basic Structure

```html
<mat-sidenav-container>
  <mat-sidenav #sidenav mode="side" opened>
    Navigation content
  </mat-sidenav>
  <mat-sidenav-content>
    Main content
  </mat-sidenav-content>
</mat-sidenav-container>
```

### Modes

| Mode | Behavior |
|------|----------|
| `over` | Floats over content with backdrop (default) |
| `push` | Pushes content aside with backdrop |
| `side` | Sits beside content, no backdrop |

```html
<mat-sidenav mode="side" opened>...</mat-sidenav>
```

### Opening/Closing

```html
<mat-sidenav #sidenav>...</mat-sidenav>
<button (click)="sidenav.toggle()">Toggle</button>
```

```ts
sidenav = viewChild.required<MatSidenav>(MatSidenav);

async openNav(): Promise<void> {
  const opened = await this.sidenav().open();
}
```

### Two Sidenavs

```html
<mat-sidenav-container>
  <mat-sidenav position="start">Left nav</mat-sidenav>
  <mat-sidenav position="end">Right nav</mat-sidenav>
  <mat-sidenav-content>Content</mat-sidenav-content>
</mat-sidenav-container>
```

### Fixed Positioning

```html
<mat-sidenav fixedInViewport fixedTopGap="64" fixedBottomGap="0">
```

### Disable Close

Prevent backdrop click and ESC from closing:

```html
<mat-sidenav [disableClose]="true">
```

### Drawer (Smaller Sections)

Same API, for partial page areas:

```html
<mat-drawer-container>
  <mat-drawer mode="side" opened>Drawer</mat-drawer>
  <mat-drawer-content>Content</mat-drawer-content>
</mat-drawer-container>
```

---

## Menu

Floating panel of options.

### Basic Menu

```html
<button mat-button [matMenuTriggerFor]="menu">Options</button>

<mat-menu #menu="matMenu">
  <button mat-menu-item>Edit</button>
  <button mat-menu-item>Delete</button>
</mat-menu>
```

### With Icons

```html
<mat-menu #menu="matMenu">
  <button mat-menu-item>
    <mat-icon>edit</mat-icon>
    <span>Edit</span>
  </button>
</mat-menu>
```

### Nested Menus

```html
<mat-menu #animals="matMenu">
  <button mat-menu-item [matMenuTriggerFor]="cats">Cats</button>
  <button mat-menu-item [matMenuTriggerFor]="dogs">Dogs</button>
</mat-menu>

<mat-menu #cats="matMenu">
  <button mat-menu-item>Siamese</button>
  <button mat-menu-item>Persian</button>
</mat-menu>
```

### Context Menu

```html
<div [matContextMenuTriggerFor]="contextMenu" class="context-area">
  Right-click here
</div>

<mat-menu #contextMenu="matMenu">
  <button mat-menu-item>Copy</button>
  <button mat-menu-item>Paste</button>
</mat-menu>
```

### Positioning

```html
<mat-menu #menu xPosition="before" yPosition="above">
```

### Lazy Content

```html
<mat-menu #menu>
  <ng-template matMenuContent>
    <button mat-menu-item>Lazy loaded</button>
  </ng-template>
</mat-menu>
```

### Data to Menu

```html
<button [matMenuTriggerFor]="menu" [matMenuTriggerData]="{user: currentUser}">
  User Menu
</button>

<mat-menu #menu>
  <ng-template matMenuContent let-user="user">
    <button mat-menu-item>{{user.name}}</button>
  </ng-template>
</mat-menu>
```

---

## Toolbar

Container for headers and titles.

```html
<mat-toolbar>
  <button mat-icon-button (click)="sidenav.toggle()">
    <mat-icon>menu</mat-icon>
  </button>
  <span>My App</span>
  <span class="spacer"></span>
  <button mat-icon-button>
    <mat-icon>settings</mat-icon>
  </button>
</mat-toolbar>
```

### Multiple Rows

```html
<mat-toolbar>
  <mat-toolbar-row>First row</mat-toolbar-row>
  <mat-toolbar-row>Second row</mat-toolbar-row>
</mat-toolbar>
```

---

## Tabs

Organize content into views.

### Basic Tabs

```html
<mat-tab-group>
  <mat-tab label="First">Content 1</mat-tab>
  <mat-tab label="Second">Content 2</mat-tab>
  <mat-tab label="Third">Content 3</mat-tab>
</mat-tab-group>
```

### Custom Labels

```html
<mat-tab>
  <ng-template mat-tab-label>
    <mat-icon>thumb_up</mat-icon>
    Favorites
  </ng-template>
  Content
</mat-tab>
```

### Lazy Loading

```html
<mat-tab label="Heavy Content">
  <ng-template matTabContent>
    <!-- Only loaded when tab is active -->
    <heavy-component />
  </ng-template>
</mat-tab>
```

### Navigation Tabs

Route-based navigation:

```html
<nav mat-tab-nav-bar>
  <a mat-tab-link routerLink="/dashboard" routerLinkActive #rla1="routerLinkActive"
     [active]="rla1.isActive">Dashboard</a>
  <a mat-tab-link routerLink="/settings" routerLinkActive #rla2="routerLinkActive"
     [active]="rla2.isActive">Settings</a>
</nav>

<mat-tab-nav-panel>
  <router-outlet />
</mat-tab-nav-panel>
```

### Events

```ts
<mat-tab-group (selectedTabChange)="onTabChange($event)">
```

### Configuration

```html
<mat-tab-group 
  [selectedIndex]="0"
  [dynamicHeight]="true"
  [animationDuration]="300ms"
  [preserveContent]="true"
  mat-align-tabs="center">
```

## Accessibility

- Add `role` attributes to sidenav (`navigation`, `directory`, `region`)
- Label menus with `aria-label`
- Place `mat-tab-nav-panel` near `mat-tab-nav-bar`
- Provide labels for icon-only toolbar buttons

## Key Points

- Sidenav modes: `over` (overlay), `push` (slide), `side` (persistent)
- Menu supports nesting, context menus, and lazy content
- Tabs support lazy loading via `matTabContent`
- Nav tabs (`mat-tab-nav-bar`) for route-based navigation
- All components support keyboard navigation

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/sidenav/sidenav.md
- https://github.com/angular/components/blob/main/src/material/menu/menu.md
- https://github.com/angular/components/blob/main/src/material/tabs/tabs.md
-->
