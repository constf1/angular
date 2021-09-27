/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CrosswordSettingsService } from '../services/crossword-settings.service';

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

type TreeNodeCallback = (node: TreeNode, stack: number[]) => boolean;

function forEachTreeNode(node: TreeNode, callback: TreeNodeCallback, stack: number[]) {
  if (callback(node, stack)) {
    const children = node.children;
    if (children) {
      const index = stack.length;
      for (let i = 0; i < children.length; i++) {
        stack[index] = i;
        forEachTreeNode(children[i], callback, stack);
      }
      stack.length = index;
    }
  }
}

const WORD_SEPARATOR = ',';
const NODE_SEPARATOR = '/';

function getTreeSelectionState(root: TreeNode): string {
  const buf: string[] = [];
  forEachTreeNode(root, (node, stack) => {
    if (node.selected) {
      buf.push(stack.join(NODE_SEPARATOR));
    }
    return !node.selected;
  }, [0]);
  return buf.join(WORD_SEPARATOR);
}

function setTreeSelectionState(root: TreeNode, state?: string): void {
  if (state) {
    const selected = new Set<string>(state.split(WORD_SEPARATOR));
    forEachTreeNode(root, (node, stack) => {
      const key = stack.join(NODE_SEPARATOR);
      setTreeNodeSelected(node, selected.has(key));
      return !node.selected;
    }, [0]);
  } else {
    setTreeNodeSelected(root, false);
  }
}

export type Data = { [key: string]: string };

@Component({
  selector: 'app-crossword-data-tree',
  templateUrl: './crossword-data-tree.component.html',
  styleUrls: ['./crossword-data-tree.component.scss']
})
export class CrosswordDataTreeComponent implements OnInit {
  @Output() dataChange = new EventEmitter<Data>();

  errorMessage: string;
  root: TreeNode;

  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource: ArrayDataSource<TreeNode>;

  constructor(public settings: CrosswordSettingsService, private _http: HttpClient) { }

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
    // Save tree selection state
    this.settings.set({
      crosswordDataTreeState: getTreeSelectionState(this.root)
    });
    this.onDataChange();
  }

  ngOnInit(): void {
    this._http.get(ASSETS_URL).subscribe({
      next: (data) => {
        const root = makeTreeNode('', data);
        // Update capacity info.
        setTreeNodeSelected(root, true);
        onTreeNodeSelectionChange(root);
        // Load and set previously saved tree selection state.
        setTreeSelectionState(root, this.settings.state.crosswordDataTreeState);
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
