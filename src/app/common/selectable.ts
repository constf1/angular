export interface Selectable {
  selected?: boolean;
}

export type SelectableList = ReadonlyArray<Selectable>;
export type SelectableView = ReadonlyArray<Readonly<Selectable>>;

// Stats.
export function countSelected(items: SelectableView) {
  let count = 0;
  for (const item of items) {
    if (item.selected) {
      count++;
    }
  }
  return count;
}

export function getSelectedIndices(items: SelectableView): number[] {
  const selections: number[] = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].selected) {
      selections.push(i);
    }
  }
  return selections;
}

export function getFirstSelectionIndex(items: SelectableView): number {
  for (let i = 0; i < items.length; i++) {
    if (items[i].selected) {
      return i;
    }
  }
  return -1;
}

export function getLastSelectionIndex(items: SelectableView): number {
  for (let i = items.length; i-- > 0;) {
    if (items[i].selected) {
      return i;
    }
  }
  return -1;
}

export function hasSelection(items: SelectableView): boolean {
  return getFirstSelectionIndex(items) >= 0;
}

export function isAllSelected(items: SelectableView): boolean {
  for (const item of items) {
    if (!item.selected) {
      return false;
    }
  }
  return true;
}

export function isSomeSelected(items: SelectableView): boolean {
  const count = countSelected(items);
  return count > 0 && count < items.length;
}

// Change.
export function selectItem(items: SelectableList, index: number, value: boolean) {
  const item = items[index];
  if (item) {
    item.selected = value;
  }
}

export function selectAll(items: SelectableList, value: boolean) {
  for (const item of items) {
    item.selected = value;
  }
}

export function selectDistinct(items: SelectableList, index: number, value: boolean) {
  selectAll(items, !value);
  selectItem(items, index, value);
}

export function selectGroup(items: SelectableList, indices: ReadonlyArray<number>, value: boolean) {
  selectAll(items, !value);
  for (const index of indices) {
    selectItem(items, index, value);
  }
}

export function invertSelection(items: SelectableList) {
  for (const item of items) {
    item.selected = !item.selected;
  }
}
