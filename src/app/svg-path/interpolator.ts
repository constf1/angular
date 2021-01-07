import { lastItem } from '../common/array-utils';
import { approximateEllipticalArc } from './arc-node';
import { ClosePath, EllipticalArc, isClosePath, isCurveTo, isEllipticalArc, isMoveTo, MoveTo } from './command';
import { getGroups, getX, getY, makePath, PathNode } from './node';
import { canPromoteToCurve, promoteToCurve } from './promoter';
import { bisect, split } from './splitter';

type NormalizedNode = Exclude<PathNode, EllipticalArc & ClosePath>;

function stretch(pathGroup: PathNode[], size: number): PathNode[] {
  const first = pathGroup[0];
  if (!(first && isMoveTo(first))) {
    throw new Error('First node in a path group should be MoveTo!');
  }

  const items: PathNode[] = [{ ...first }];

  const a = pathGroup.length - 1;
  const b = size - 1;

  if (a > 0) {
    // Splitting existing nodes.
    const r = b % a;
    const n = (b - r) / a;
    for (let i = 1; i <= a; i++) {
      const node = pathGroup[i];
      const x = (i <= r ? n + 1 : n);
      if (x > 1) {
        items.concat(split(node, x));
      } else {
        items.push({ ...node });
      }
    }
  } else {
    // Adding empty nodes.
    for (let i = 0; i < b; i++) {
      items.push({ name: 'L', x: first.x, y: first.y });
    }
  }
  return makePath(items);
}

function align(pathGroupA: PathNode[], pathGroupB: PathNode[]) {
  const count = Math.max(pathGroupA.length, pathGroupB.length);

  if (pathGroupA.length < count) {
    pathGroupA = stretch(pathGroupA, count);
  } else if (pathGroupB.length < count) {
    pathGroupB = stretch(pathGroupB, count);
  }

  const itemsA: PathNode[] = [];
  const itemsB: PathNode[] = [];

  for (let i = 0; i < count; i++) {
    const a = pathGroupA[i];
    const b = pathGroupB[i];
    if (a.name === b.name) {
      itemsA.push({ ...a });
      itemsB.push({ ...b });
    } else {
      itemsA.push(canPromoteToCurve(a) ? promoteToCurve(a) : { ...a });
      itemsB.push(canPromoteToCurve(b) ? promoteToCurve(b) : { ...b });
    }
  }

  return [makePath(itemsA), makePath(itemsB)];
}

// function toCurves(path: PathNode[]): PathNode[] {
//   const items: PathNode[] = [];
//   for (const node of path) {
//     if (isEllipticalArc(node)) {
//       items.concat(approximateEllipticalArc(node));
//     } else if (isClosePath(node)) {
//       const prev = node.prev;
//       const x0 = getX(prev);
//       const y0 = getY(prev);
//       const x = getX(node);
//       const y = getY(node);
//       if (x0 !== x || y0 !== y) {
//         items.push(promoteToCurve({ name: 'L', x, y, prev }));
//       }
//       items.push({ name: 'Z'});
//     } else {
//       items.push(canPromoteToCurve(node) ? promoteToCurve(node) : { ...node });
//     }
//   }
//   return makePath(items);
// }

function normalize(path: PathNode[]): NormalizedNode[] {
  const items: NormalizedNode[] = [];

  // Let's start with a MoveTo node.
  if (path.length <= 0 || !isMoveTo(path[0])) {
    items.push({ name: 'M', x: 0, y: 0 });
  }

  // Get rid of EllipticalArcs and ClosePaths.
  for (const node of path) {
    if (isEllipticalArc(node)) {
      items.concat(approximateEllipticalArc(node));
    } else if (isClosePath(node)) {
      const prev = node.prev;
      const x0 = getX(prev);
      const y0 = getY(prev);
      const x = getX(node);
      const y = getY(node);
      if (x0 !== x || y0 !== y) {
        items.push({ name: 'L', x, y });
      }
    } else {
      items.push({ ...node });
    }
  }
  return makePath(items);
}

export function interpolate(src: PathNode[], dst: PathNode[]) {
  const srcGroups = getGroups(normalize(src));
  const dstGroups = getGroups(normalize(dst));

  while (srcGroups.length < dstGroups.length) {
    const prev = lastItem(lastItem(srcGroups));
    srcGroups.push([{ name: 'M', x: getX(prev), y: getY(prev), prev}]);
  }
  while (dstGroups.length < srcGroups.length) {
    const prev = lastItem(lastItem(dstGroups));
    dstGroups.push([{ name: 'M', x: getX(prev), y: getY(prev), prev}]);
  }

  const itemsA: PathNode[] = [];
  const itemsB: PathNode[] = [];
  for (let i = 0; i < srcGroups.length; i++) {
    const [a, b] = align(srcGroups[i], dstGroups[i]);
    itemsA.concat(a);
    itemsB.concat(b);
  }

  return [makePath(itemsA), makePath(itemsB)];
}
