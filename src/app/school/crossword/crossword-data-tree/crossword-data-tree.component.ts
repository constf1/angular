// tslint:disable: variable-name
import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

const ASSETS_URL = 'assets/school/crossword/data.json';

type TreeNode = {
  name: string;
  dict: Map<string, string>;
  capacity: number;
  children?: TreeNode[];
  selected?: boolean;
  indeterminate?: boolean;
};

function makeTreeNode(name: string, data: any): TreeNode {
  let children: TreeNode[];
  let dict = new Map<string, string>();

  for (const key of Object.keys(data)) {
    const item = data[key];
    if (typeof item === 'object') {
      const child = makeTreeNode(key, item);
      if (children) {
        children.push(child);
      } else {
        children = [child];
      }
    } else if (typeof item === 'string') {
      dict.set(key, item);
    }
  }
  if (children && dict.size > 0) {
    children.push({ name: '', dict, capacity: dict.size });
    dict = new Map<string, string>();
  }
  return { name, dict, capacity: dict.size, children };
}

function setTreeNodeSelected(node: TreeNode, value?: boolean): void {
  if (node.children) {
    for (const child of node.children) {
      setTreeNodeSelected(child, value);
    }
  }
  node.selected = value;
}

function onTreeNodeSelectionChange(node: TreeNode): void {
  if (node.children) {
    let count = 0;
    let indeterminate = false;
    node.dict.clear();

    for (const child of node.children) {
      onTreeNodeSelectionChange(child);

      if (child.selected) {
        count++;
      }

      if (child.indeterminate) {
        indeterminate = true;
      }

      if (child.selected || child.indeterminate) {
        child.dict.forEach((value, key) => node.dict.set(key, value));
      }
    }

    node.selected = count === node.children.length;
    node.indeterminate = indeterminate || (count > 0 && count < node.children.length);
    node.capacity = Math.max(node.dict.size, node.capacity);
  }
}

export type Data = { [key: string]: string };

@Component({
  selector: 'app-crossword-data-tree',
  templateUrl: './crossword-data-tree.component.html',
  styleUrls: ['./crossword-data-tree.component.scss']
})
export class CrosswordDataTreeComponent implements OnInit {
  errorMessage: string;
  root: TreeNode;

  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource: ArrayDataSource<TreeNode>;

  @Output() dataChange = new EventEmitter<Data>();

  constructor(private _http: HttpClient) { }

  isNodeExpanded(node: TreeNode) {
    return this.treeControl.isExpanded(node);
  }

  isNodeParent(node: TreeNode) {
    return !!node.children && node.children.length > 0;
  }

  getNodeIcon(node: TreeNode) {
    return this.isNodeParent(node) ? this.isNodeExpanded(node) ? 'expand_more' : 'chevron_right' : '';
  }

  getNodeInfo(node: TreeNode) {
    return node.indeterminate ? `(${node.dict.size} of ${node.capacity})` : `(${node.capacity})`;
  }

  getNodeVisibility(node: TreeNode) {
    return this.isNodeParent(node) ? 'visible' : 'hidden';
  }

  setNodeChecked(node: TreeNode, value: boolean) {
    setTreeNodeSelected(node, value);
    onTreeNodeSelectionChange(this.root);
    this.onDataChange();
  }

  ngOnInit(): void {
    this._http.get(ASSETS_URL).subscribe({
      next: (data) => {
        const root = makeTreeNode('', data);
        // Update capacity info.
        setTreeNodeSelected(root, true);
        onTreeNodeSelectionChange(root);
        // TODO: Load and set previously saved tree selection state.
        setTreeNodeSelected(root, false);
        onTreeNodeSelectionChange(root);

        this.root = root;
        this.dataSource = new ArrayDataSource(this.root.children || [this.root]);
        this.onDataChange();
      },
      error: (err) => {
        this.errorMessage = 'HTTP load failed!';
        console.error('HTTP load error:', err);
      }
    });
  }

  onDataChange() {
    if (this.root) {
      const data: Data = {};
      this.root.dict.forEach((value, key) => data[key] = value);
      this.dataChange.emit(data);
    }
  }
}
