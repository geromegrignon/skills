---
name: cdk-tree
description: Foundation for building custom tree components with hierarchical data
---

# CDK Tree

## Imports

```ts
import { CdkTreeModule, CdkTree, CdkTreeNode, CdkNestedTreeNode, CdkTreeNodeDef, CdkTreeNodeOutlet, CdkTreeNodeToggle, CdkTreeNodePadding } from '@angular/cdk/tree';
```

Unstyled tree component for displaying hierarchical data.

## Flat Tree

Nodes rendered as siblings with level-based indentation:

```html
<cdk-tree [dataSource]="dataSource" [childrenAccessor]="childrenAccessor">
  <cdk-tree-node *cdkTreeNodeDef="let node" [isExpandable]="hasChildren(node)">
    <button cdkTreeNodeToggle [attr.aria-label]="'Toggle ' + node.name">
      {{ node.isExpanded ? '▼' : '▶' }}
    </button>
    {{ node.name }}
  </cdk-tree-node>
</cdk-tree>
```

```ts
interface FileNode {
  name: string;
  children?: FileNode[];
}

@Component({...})
export class FlatTreeExample {
  dataSource: FileNode[] = [
    {
      name: 'Documents',
      children: [
        { name: 'Report.pdf' },
        { name: 'Budget.xlsx' }
      ]
    },
    {
      name: 'Photos',
      children: [
        { name: 'Vacation.jpg' },
        { name: 'Family.png' }
      ]
    }
  ];

  childrenAccessor = (node: FileNode) => node.children ?? [];
  hasChildren = (node: FileNode) => !!node.children?.length;
}
```

## Nested Tree

Children rendered inside parent nodes:

```html
<cdk-tree [dataSource]="dataSource" [childrenAccessor]="childrenAccessor">
  <cdk-nested-tree-node *cdkTreeNodeDef="let node" [isExpandable]="hasChildren(node)">
    <div class="node-content">
      <button cdkTreeNodeToggle>
        {{ node.isExpanded ? '▼' : '▶' }}
      </button>
      {{ node.name }}
    </div>
    @if (node.isExpanded()) {
    <div class="children">
      <ng-container cdkTreeNodeOutlet></ng-container>
    </div>
  </cdk-nested-tree-node>
</cdk-tree>
```

## Data Source Configuration

### Using childrenAccessor (Recommended)

Provide only root nodes, tree handles expansion:

```ts
@Component({...})
export class TreeExample {
  // Only root nodes
  dataSource = [
    { name: 'Root 1', children: [...] },
    { name: 'Root 2', children: [...] }
  ];

  // Function to get children
  childrenAccessor = (node: TreeNode) => node.children ?? [];
}
```

### Using levelAccessor

For pre-flattened data:

```ts
@Component({...})
export class FlattenedTreeExample {
  // All nodes flattened with level info
  dataSource = [
    { name: 'Root', level: 0 },
    { name: 'Child 1', level: 1 },
    { name: 'Grandchild', level: 2 },
    { name: 'Child 2', level: 1 },
  ];

  levelAccessor = (node: FlatNode) => node.level;
}
```

## Expand/Collapse

### Toggle Button

```html
<button 
  cdkTreeNodeToggle 
  [cdkTreeNodeToggleRecursive]="true"
  [attr.aria-label]="'Toggle ' + node.name">
  {{ isExpanded(node) ? '▼' : '▶' }}
</button>
```

### Programmatic Control

```ts
tree = viewChild.required<CdkTree<TreeNode>>(CdkTree);

expandAll(): void {
  this.tree().expandAll();
}

collapseAll(): void {
  this.tree().collapseAll();
}

expandNode(node: TreeNode): void {
  this.tree().expand(node);
}

toggleNode(node: TreeNode): void {
  this.tree().toggle(node);
}
```

## Conditional Templates

Different templates based on node type:

```html
<cdk-tree [dataSource]="dataSource" [childrenAccessor]="childrenAccessor">
  <!-- Default template -->
  <cdk-tree-node *cdkTreeNodeDef="let node">
    📄 {{ node.name }}
  </cdk-tree-node>

  <!-- Folder template -->
  <cdk-tree-node *cdkTreeNodeDef="let node; when: isFolder" [isExpandable]="true">
    <button cdkTreeNodeToggle>
      {{ node.isExpanded ? '📂' : '📁' }}
    </button>
    {{ node.name }}
  </cdk-tree-node>
</cdk-tree>
```

```ts
isFolder = (node: FileNode) => !!node.children;
```

## Padding (Flat Tree)

```html
<cdk-tree-node 
  *cdkTreeNodeDef="let node" 
  cdkTreeNodePadding
  [cdkTreeNodePaddingIndent]="20">
  {{ node.name }}
</cdk-tree-node>
```

Or use CSS with `aria-level`:

```scss
cdk-tree-node {
  display: block;
  
  &[aria-level="1"] { padding-left: 0; }
  &[aria-level="2"] { padding-left: 20px; }
  &[aria-level="3"] { padding-left: 40px; }
}
```

## TrackBy for Performance

```html
<cdk-tree 
  [dataSource]="dataSource" 
  [childrenAccessor]="childrenAccessor"
  [trackBy]="trackByFn">
```

```ts
trackByFn(index: number, node: TreeNode): string {
  return node.id;
}
```

## Activation Events

Handle node clicks/activation:

```html
<cdk-tree-node 
  *cdkTreeNodeDef="let node"
  (click)="onNodeClick(node)"
  (activation)="onNodeActivate($event)">
  {{ node.name }}
</cdk-tree-node>
```

```ts
onNodeClick(node: TreeNode): void {
  console.log('Clicked:', node);
}

onNodeActivate(node: TreeNode): void {
  // Fired on Enter/Space key
  console.log('Activated:', node);
}
```

## isExpandable Property

Required for accessibility:

```html
<cdk-tree-node 
  *cdkTreeNodeDef="let node"
  [isExpandable]="hasChildren(node)">
</cdk-tree-node>
```

## Complete Example

```ts
interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
}

@Component({
  selector: 'file-tree',
  template: `
    <cdk-tree 
      [dataSource]="files" 
      [childrenAccessor]="childrenAccessor"
      [trackBy]="trackBy">
      
      <!-- File node -->
      <cdk-tree-node 
        *cdkTreeNodeDef="let node"
        class="file-node"
        (activation)="openFile(node)">
        📄 {{ node.name }}
      </cdk-tree-node>
      
      <!-- Folder node -->
      <cdk-tree-node 
        *cdkTreeNodeDef="let node; when: isFolder"
        class="folder-node"
        [isExpandable]="true">
        <button 
          cdkTreeNodeToggle
          class="toggle-btn"
          [attr.aria-label]="'Toggle ' + node.name">
          @if (tree().isExpanded(node)) {
            📂
          } @else {
            📁
          }
        </button>
        {{ node.name }}
      </cdk-tree-node>
    </cdk-tree>
  `
})
export class FileTree {
  tree = viewChild.required<CdkTree<TreeNode>>(CdkTree);

  files: TreeNode[] = [
    {
      id: '1',
      name: 'src',
      type: 'folder',
      children: [
        { id: '2', name: 'app.ts', type: 'file' },
        { id: '3', name: 'index.html', type: 'file' }
      ]
    }
  ];

  childrenAccessor = (node: TreeNode) => node.children ?? [];
  isFolder = (node: TreeNode) => node.type === 'folder';
  trackBy = (_: number, node: TreeNode) => node.id;

  openFile(node: TreeNode): void {
    console.log('Opening file:', node.name);
  }
}
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `↓` | Move to next visible node |
| `↑` | Move to previous visible node |
| `→` | Expand node / move to first child |
| `←` | Collapse node / move to parent |
| `Home` | Move to first node |
| `End` | Move to last visible node |
| `Enter` / `Space` | Activate node (fires `activation` event) |

## Key Points

- `cdk-tree` container with `dataSource` input
- `cdk-tree-node` for flat trees, `cdk-nested-tree-node` for nested
- `childrenAccessor` for nested data, `levelAccessor` for flat
- `cdkTreeNodeToggle` directive for expand/collapse
- `cdkTreeNodeDef` with `when` for conditional templates
- `cdkTreeNodeOutlet` required in nested tree nodes
- `isExpandable` property required for accessibility
- `trackBy` for performance with large trees

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/tree/tree.md
- https://material.angular.dev/cdk/tree/overview
-->
