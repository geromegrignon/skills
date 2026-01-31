---
name: component-tree
description: Hierarchical data display with flat and nested tree structures
---

# Tree

## Imports

```ts
import { MatTreeModule, MatTree } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
```

Display hierarchical data in expandable tree structure.

## Tree Types

| Type | Description |
|------|-------------|
| Flat tree | Nodes rendered as siblings, hierarchy via padding |
| Nested tree | DOM mirrors data hierarchy |

## Flat Tree

```html
<mat-tree [dataSource]="dataSource" [childrenAccessor]="childrenAccessor">
  <mat-tree-node *matTreeNodeDef="let node" matNodePadding>
    <button mat-icon-button disabled></button>
    {{node.name}}
  </mat-tree-node>
  
  <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matNodePadding>
    <button mat-icon-button matTreeNodeToggle
            [attr.aria-label]="'Toggle ' + node.name">
      <mat-icon>
        {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
      </mat-icon>
    </button>
    {{node.name}}
  </mat-tree-node>
</mat-tree>
```

```ts
interface FileNode {
  name: string;
  children?: FileNode[];
}

dataSource: FileNode[] = [
  {
    name: 'Documents',
    children: [
      {name: 'Report.pdf'},
      {name: 'Notes.txt'}
    ]
  }
];

childrenAccessor = (node: FileNode) => node.children ?? [];

hasChild = (_: number, node: FileNode) => !!node.children?.length;
```

## Nested Tree

```html
<mat-tree [dataSource]="dataSource" [childrenAccessor]="childrenAccessor">
  <mat-nested-tree-node *matTreeNodeDef="let node">
    <div class="mat-tree-node">
      <button mat-icon-button disabled></button>
      {{node.name}}
    </div>
  </mat-nested-tree-node>
  
  <mat-nested-tree-node *matTreeNodeDef="let node; when: hasChild">
    <div class="mat-tree-node">
      <button mat-icon-button matTreeNodeToggle
              [attr.aria-label]="'Toggle ' + node.name">
        <mat-icon>
          {{isExpanded(node) ? 'expand_more' : 'chevron_right'}}
        </mat-icon>
      </button>
      {{node.name}}
    </div>
    <div class="nested-children" [class.hidden]="!isExpanded(node)">
      <ng-container matTreeNodeOutlet></ng-container>
    </div>
  </mat-nested-tree-node>
</mat-tree>
```

## Data Source Options

### Using `childrenAccessor`

Provide only root nodes, tree handles hierarchy:

```ts
dataSource = [rootNode1, rootNode2];
childrenAccessor = (node: Node) => node.children;
```

### Using `levelAccessor`

Provide flattened array with level information:

```ts
interface FlatNode {
  name: string;
  level: number;
  expandable: boolean;
}

dataSource: FlatNode[] = [
  {name: 'Parent', level: 0, expandable: true},
  {name: 'Child', level: 1, expandable: false}
];

levelAccessor = (node: FlatNode) => node.level;
```

## Expand/Collapse

### Single Node Toggle

```html
<button matTreeNodeToggle [matTreeNodeToggleRecursive]="false">
  Toggle
</button>
```

### Recursive Toggle

```html
<button matTreeNodeToggle [matTreeNodeToggleRecursive]="true">
  Toggle with children
</button>
```

### Programmatic Control

```ts
tree = viewChild.required<MatTree>(MatTree);

expandAll(): void {
  this.tree().expandAll();
}

collapseAll(): void {
  this.tree().collapseAll();
}

expand(node: Node): void {
  this.tree().expand(node);
}

collapse(node: Node): void {
  this.tree().collapse(node);
}

toggle(node: Node): void {
  this.tree().toggle(node);
}

isExpanded(node: Node): boolean {
  return this.tree().isExpanded(node);
}
```

## Conditional Templates

```html
<mat-tree-node *matTreeNodeDef="let node">
  Regular node: {{node.name}}
</mat-tree-node>

<mat-tree-node *matTreeNodeDef="let node; when: isSpecial">
  Special node: {{node.name}}
</mat-tree-node>
```

```ts
isSpecial = (_: number, node: Node) => node.type === 'special';
```

## Track By

Improve performance with trackBy:

```html
<mat-tree [dataSource]="dataSource" 
          [childrenAccessor]="childrenAccessor"
          [trackBy]="trackByFn">
```

```ts
trackByFn = (index: number, node: Node) => node.id;
```

## Activation Events

Handle node click/keyboard activation:

```html
<mat-tree-node *matTreeNodeDef="let node"
               (click)="selectNode(node)"
               (activation)="selectNode($event)">
  {{node.name}}
</mat-tree-node>
```

## Expansion Events

```html
<mat-tree-node *matTreeNodeDef="let node"
               (expansionChange)="onExpansionChange(node, $event)">
```

```ts
onExpansionChange(node: Node, expanded: boolean): void {
  if (expanded) {
    this.loadChildren(node);
  }
}
```

## Lazy Loading Children

```ts
loadChildren(node: Node): void {
  if (!node.childrenLoaded) {
    this.dataService.getChildren(node.id).subscribe(children => {
      node.children = children;
      node.childrenLoaded = true;
    });
  }
}
```

## Accessibility

- Tree uses `role="tree"` pattern
- Use `levelAccessor` or `childrenAccessor` for proper ARIA
- Set `isExpandable` on expandable nodes
- Add `aria-label` to toggle buttons

```html
<mat-tree-node *matTreeNodeDef="let node" [isExpandable]="hasChild(node)">
  <button mat-icon-button matTreeNodeToggle
          [attr.aria-label]="'Toggle ' + node.name">
```

## Key Points

- Flat tree: nodes as siblings, use `matNodePadding`
- Nested tree: DOM mirrors hierarchy, use `matTreeNodeOutlet`
- `childrenAccessor`: provide root data, tree handles children
- `levelAccessor`: provide flattened array with levels
- `matTreeNodeToggle` handles expand/collapse
- `[matTreeNodeToggleRecursive]` for recursive toggle
- Always use `trackBy` for better performance
- Use `(activation)` for keyboard-accessible actions

<!--
Source references:
- https://github.com/angular/components/blob/main/src/material/tree/tree.md
- https://material.angular.dev/components/tree/overview
-->
