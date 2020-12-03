import { append, connect, Linkable } from 'src/app/common/linkable';
import { ReadonlyMatrix } from 'src/app/common/matrix-math';
import { transformedNode } from './svg-path-transform';

import * as Path from './svg-path-node';
import * as Select from 'src/app/common/selectable';

// reexport
export * from './svg-path-node';
export * from 'src/app/common/selectable';

export type PathItem = Path.PathNode & Linkable<PathItem> & Select.Selectable & { outputAsRelative?: boolean };
export type PathArray = ReadonlyArray<PathItem>;
export type PathView = ReadonlyArray<Readonly<PathItem>>;

// Convert to string
export function asFormattedString(item: Readonly<PathItem>, maximumFractionDigits?: number): string {
  return item.outputAsRelative ? Path.asRelativeString(item, maximumFractionDigits) : Path.asString(item, maximumFractionDigits);
}

export function asFormattedStringArray(items: PathView, maximumFractionDigits?: number): string[] {
  return items.map(item => asFormattedString(item, maximumFractionDigits));
}

// Split into logic groups
export function getGroups(items: PathView): PathItem[][]  {
  const groups: PathItem[][] = [];
  let next: PathItem[];
  for (const item of items) {
    if (!next || item.name === 'M') {
      if (next) {
        groups.push(next);
      }
      next = [item];
    } else {
      next.push(item);
    }
    if (item.name === 'Z') {
      groups.push(next);
      next = undefined;
    }
  }
  if (next) {
    groups.push(next);
  }
  return groups;
}

// Creation
const RE_COMMAND = /([MLHVZCSQTA])/gi;
const RE_FLAG = /[01]/;
const RE_SIGNED = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/;
const RE_UNSIGNED = /[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/;

/**
 * [Path Doc](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
 */
const REXPS: {[key in Path.DrawCommand]: Readonly<RegExp[]>} = {
  // Move To:
  //  M x y
  //  m dx dy
  M: [RE_SIGNED, RE_SIGNED],

  // Line To:
  // L x y
  // l dx dy
  L: [RE_SIGNED, RE_SIGNED],

  // Horizontal Line To:
  // H x
  // h dx
  H: [RE_SIGNED],

  // Vertical Line To:
  // V y
  // v dy
  V: [RE_SIGNED],

  // Close Path.
  Z: [],

  // Bézier curves:

  // Curve To:
  // C x1 y1, x2 y2, x y
  // c dx1 dy1, dx2 dy2, dx dy
  C: [RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED],

  // Shortcut Curve To:
  // S x2 y2, x y
  // s dx2 dy2, dx dy
  S: [RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED],

  // Quadratic Curve To:
  // Q x1 y1, x y
  // q dx1 dy1, dx dy
  Q: [RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED],

  // Shortcut Quadratic Curve To:
  // T x y
  // t dx dy
  T: [RE_SIGNED, RE_SIGNED],

  // Arc To:
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
  A: [RE_UNSIGNED, RE_UNSIGNED, RE_SIGNED, RE_FLAG, RE_FLAG, RE_SIGNED, RE_SIGNED],
};

/**
 * Helper class.
 */
class Reader {
  // tslint:disable-next-line: variable-name
  private _data = '';

  set data(value: string) {
    this._data = value.trim();
  }

  get data() {
    return this._data;
  }

  moveTo(start: number) {
    this.data = this.data.slice(start);
  }

  read(exp: RegExp): string | null {
    exp.lastIndex = 0;
    const m = exp.exec(this.data);
    if (m !== null) {
      const value = m[0];
      this.moveTo(m.index + value.length);
      return value;
    }
    return null;
  }

  readAll(exps: Readonly<RegExp[]>): string[] | null {
    const buf: string[] = [];
    for (const exp of exps) {
      const value = this.read(exp);
      if (value !== null) {
        buf.push(value);
      } else {
        return null;
      }
    }
    return buf;
  }
}

export function createFromString(pathData: string): PathItem[] {
  const nodes: PathItem[] = [];
  let node: PathItem | undefined;

  // Split by command.
  const split = pathData.split(RE_COMMAND);
  const reader = new Reader();

  for (let i = 2; i < split.length; i += 2) {
    let command = split[i - 1];
    reader.data = split[i];

    while (true) {
      const name = command.toUpperCase() as Path.DrawCommand;
      const params = reader.readAll(REXPS[name]);
      if (params !== null) {
        node = append(node, Path.createPathNode(name, params)).tail;
        if (command.toLowerCase() === command) {
          Path.translate(node, Path.getX(node.prev), Path.getY(node.prev));
          node.outputAsRelative = true;
        }
        nodes.push(node);
      } else {
        // console.warn('Couldn\'t properly parse this expression:', reader.data);
        break;
      }
      if (!reader.data || params.length === 0) {
        break;
      } else {
        if (command === 'M') {
          command = 'L';
        } else if (command === 'm') {
          command = 'l';
        }
      }
    }
  }
  return nodes;
}

function copy(item: Readonly<PathItem>): PathItem {
  return { ...item, prev: undefined, next: undefined, list: undefined };
}

function extract(item: Readonly<PathItem>): PathItem {
  if (item.prev && !item.prev.selected !== !item.selected) {
    if (Path.isSmoothCurveTo(item)) {
      const x1 = Path.getReflectedX1(item);
      const y1 = Path.getReflectedY1(item);
      return { ...item, name: 'C', x1, y1, prev: undefined, next: undefined, list: undefined };
    } else if (Path.isSmoothQCurveTo(item)) {
      const x1 = Path.getReflectedX1(item);
      const y1 = Path.getReflectedY1(item);
      return { ...item, name: 'Q', x1, y1, prev: undefined, next: undefined, list: undefined };
    }
  }
  return copy(item);
}

function connected(items: PathItem[]): PathItem[] {
  connect(...items);
  return items;
}

export function cloneAll(items: PathView): PathItem[] {
  return connected(items.map(copy));
}

export function cloneSelection(items: PathView): PathItem[] {
  const first = items[Select.getFirstSelectionIndex(items)];
  const next = items.filter(item => item.selected).map(extract);

  if (!(first && Path.isMoveTo(first))) {
    next.splice(0, 0, { name: 'M', x: Path.getX(first?.prev), y: Path.getY(first?.prev), selected: true });
  }
  return connected(next);
  // return connected(items
  //   .filter(item => item.isSelected)
  //   .map(clone));
}

export function createTransformed(items: PathView, matrix: ReadonlyMatrix): PathItem[] {
  const transformAll = !Select.hasSelection(items);

  const transformed = items.map(item => {
    const next: PathItem = (transformAll || item.selected) ? transformedNode(matrix, item) : extract(item);
    next.outputAsRelative = item.outputAsRelative;
    next.selected = item.selected;
    return next;
  });
  return connected(transformed);
}

export function deleteSelection(items: PathView): PathItem[] {
  return connected(items.filter(item => !item.selected).map(extract));
}

export function appendAt(items: PathView, index: number, ...itemsToAppend: PathView): PathItem[] {
  const next = items.map(copy);
  const addon = itemsToAppend.map(copy);
  next.splice(index, 0, ...addon);
  return connected(next);
}

function hasClosePath(items: PathView, index: number) {
  while (index < items.length) {
    const item = items[index];
    if (Path.isClosePath(item)) {
      return true;
    } else if (Path.isMoveTo(item)) {
      return false;
    }
    index++;
  }
  return false;
}

function appendReversed(items: PathView, index: number, accum: PathItem[]) {
  const item = items[index];
  const { outputAsRelative, selected } = item;

  const x = Path.getX(item.prev);
  const y = Path.getY(item.prev);

  if (Path.isEllipticalArc(item)) {
    accum.push({ name: 'A', rx: item.rx, ry: item.ry, angle: item.angle,
      largeArcFlag: item.largeArcFlag, sweepFlag: !item.sweepFlag, x, y, outputAsRelative, selected });
  } else if (Path.isLineTo(item)) {
    // if (!(node.prev && isMoveTo(node.prev))) {
      accum.push({ name: 'L', x, y, outputAsRelative, selected });
    // }
  } else if (Path.isHLineTo(item)) {
    // if (!(node.prev && isMoveTo(node.prev))) {
      accum.push({ name: 'H', x, outputAsRelative, selected });
    // }
  } else if (Path.isVLineTo(item)) {
    // if (!(node.prev && isMoveTo(node.prev))) {
      accum.push({ name: 'V', y, outputAsRelative, selected });
    // }
  } else if (Path.isCurveTo(item)) {
    if (item.next && Path.isSmoothCurveTo(item.next)) {
      accum.push({ name: 'S', x2: item.x1, y2: item.y1, x, y, outputAsRelative, selected });
    } else {
      accum.push({ name: 'C', x1: item.x2, y1: item.y2, x2: item.x1, y2: item.y1, x, y, outputAsRelative, selected });
    }
  } else if (Path.isQCurveTo(item)) {
    if (item.next && Path.isSmoothQCurveTo(item.next)) {
      accum.push({ name: 'T', x, y, outputAsRelative, selected });
    } else {
      accum.push({ name: 'Q', x1: item.x1, y1: item.y1, x, y, outputAsRelative, selected });
    }
  } else if (Path.isSmoothCurveTo(item)) {
    if (item.next && Path.isSmoothCurveTo(item.next)) {
      accum.push({ name: 'S', x2: Path.getReflectedX1(item), y2: Path.getReflectedY1(item), x, y, outputAsRelative, selected });
    } else {
      accum.push({ name: 'C', x1: item.x2, y1: item.y2, x2: Path.getReflectedX1(item), y2: Path.getReflectedY1(item),
        x, y, outputAsRelative, selected });
    }
  } else if (Path.isSmoothQCurveTo(item)) {
    if (item.next && Path.isSmoothQCurveTo(item.next)) {
      accum.push({ name: 'T', x, y, outputAsRelative, selected });
    } else {
      accum.push({ name: 'Q', x1: Path.getReflectedX1(item), y1: Path.getReflectedY1(item), x, y, outputAsRelative, selected });
    }
  } else {
    const x0 = Path.getX(item);
    const y0 = Path.getY(item);

    if (Path.isMoveTo(item)) {
      if (hasClosePath(items, index + 1)) {
        accum.push({ name: 'Z', outputAsRelative, selected });
      }
      if (item.prev && (x0 !== x || y0 !== y)) {
        accum.push({ name: 'M', x, y, outputAsRelative: item.prev.outputAsRelative, selected: item.prev.selected });
      }
    } else if (Path.isClosePath(item)) {
      if (x0 !== x) {
        if (y0 !== y) {
          accum.push({ name: 'L', x, y, outputAsRelative, selected });
        } else {
          accum.push({ name: 'H', x, outputAsRelative, selected });
        }
      } else if (y0 !== y) {
        accum.push({ name: 'V', y, outputAsRelative, selected });
      }
    }
  }
}

export function createReveresed(items: PathView): PathItem[] {
  const reveresed: PathItem[] = [];
  let i = items.length;
  if (i > 0) {
    const last = items[i - 1];
    reveresed.push({ name: 'M', x: Path.getX(last), y: Path.getY(last),
      outputAsRelative: last.outputAsRelative, selected: last.selected });
    while (i-- > 0) {
      appendReversed(items, i, reveresed);
    }
  }
  return connected(reveresed);
}

// In place changes.
export function setOutputAsRelative(items: PathArray, relative: boolean) {
  const transformAll = !Select.hasSelection(items);

  for (const item of items) {
    if (transformAll || item.selected) {
      item.outputAsRelative = relative;
    }
  }
}

export function moveAt(items: PathArray, index: number, dx: number, dy: number) {
  const item = items[index];
  if (item && (dx !== 0 || dy !== 0)) {
    if (item.selected) {
      // Translate all selected items.
      const x0 = Path.getX(item);
      const y0 = Path.getY(item);
      Path.translate(item, dx, dy);

      dx = Path.getX(item) - x0;
      dy = Path.getY(item) - y0;
      if (dx !== 0 || dy !== 0) {
        for (let i = index + 1; i < items.length; i++) {
          const next = items[i];
          if (next.selected) {
            Path.translate(next, dx, dy);
          }
        }
      }
    } else {
      Path.translateStopPoint(item, dx, dy);
    }
  }
}

export function curve1At(items: PathArray, index: number, dx: number, dy: number) {
  const item = items[index];
  if (item && (dx !== 0 || dy !== 0) && Path.hasControlPoint1(item)) {
    item.x1 += dx;
    item.y1 += dy;
  }
}

export function curve2At(items: PathArray, index: number, dx: number, dy: number) {
  const item = items[index];
  if (item && (dx !== 0 || dy !== 0) && Path.hasControlPoint2(item)) {
    item.x2 += dx;
    item.y2 += dy;
  }
}