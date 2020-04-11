
/**
 * Head-tail linked list interface
 */
export interface IList {
  length: number;
  head?: ILinkable | null;
  tail?: ILinkable | null;
}

/**
 * Doubly linked node interface
 */
export interface ILinkable {
  next?: ILinkable | null;
  prev?: ILinkable | null;
  list?: IList | null;
}

/**
 * Typed head-tail linked list interface
 */
export interface List<T extends ILinkable> extends IList {
  head?: T | null;
  tail?: T | null;
}

/**
 * Typed doubly linked node interface
 */
export interface Linkable<T extends ILinkable> {
  next?: T;
  prev?: T;
  list?: List<T>;
}

/**
 * Detaches the `node` from its current position
 * @param node The node to detach
 */
export function detach(node: ILinkable): void {
  const list = node.list;
  if (list) {
    // List update
    if (list.head === node) {
      list.head = node.next;
    }
    if (list.tail === node) {
      list.tail = node.prev;
    }
    list.length--;

    // Unchain ourself from the list.
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
    node.next = null;
    node.prev = null;
    node.list = null;
  }
}

/**
 * Adds the `newNode` after the `refNode`.
 * The `newNode` will be detached from its current position and attached at the new position.
 * @param refNode The node to which the `newNode` node will be attached
 * @param newNode The node to append to the given `refNode`
 * @returns The returned value is the list with these nodes
 */
export function append<T extends Linkable<T>>(refNode: T | null, newNode: T): List<T> {
  if (refNode === newNode) {
    throw new Error('Node cannot be appended to itself');
  }
  detach(newNode);

  if (refNode) {
    // Node update
    newNode.prev = refNode;
    newNode.next = refNode.next;
    refNode.next = newNode;
    if (newNode.next) {
      newNode.next.prev = newNode;
    }
    // List update
    if (!refNode.list) {
      refNode.list = { head: refNode, tail: newNode, length: 2 };
    } else {
      refNode.list.length++;
      if (refNode.list.tail === refNode) {
        refNode.list.tail = newNode;
      }
    }
    return newNode.list = refNode.list;
  } else {
    return newNode.list = { head: newNode, tail: newNode, length: 1 };
  }
}

/**
 * Inserts the `newNode` node before the reference `refNode`.
 * The `newNode` will be detached from its current position and attached at the new position.
 * @param refNode The node before which the `newNode` node will be attached
 * @param newNode The node to be inserted
 * @returns The returned value is the list with these nodes
 */
export function prepend<T extends Linkable<T>>(refNode: T, newNode: T): List<T> {
  if (refNode === newNode) {
    throw new Error('Node cannot be prepended to itself');
  }
  // Node update
  detach(newNode);
  newNode.next = refNode;
  newNode.prev = refNode.prev;
  refNode.prev = newNode;
  if (newNode.prev) {
    newNode.prev.next = newNode;
  }

  if (!refNode.list) {
    refNode.list = { head: newNode, tail: refNode, length: 2 };
  } else {
    refNode.list.length++;
    if (refNode.list.head === refNode) {
      refNode.list.head = newNode;
    }
  }
  return newNode.list = refNode.list;
}

/**
 * Connects linkables nodes
 * @param node The node to which the `next` node will be attached
 * @param next The node to append to the given `node`
 * @param others The other nodes to append
 * @returns The returned value is the list with these nodes
 */
export function connect<T extends Linkable<T>>(...nodes: T[]): List<T> {
  let next: T = null;
  for (const node of nodes) {
    if (next) {
      append(next, node);
    }
    next = node;
  }
  return next?.list;
}

export function forEachNext<T extends Linkable<T>>(node: T | null, callback: (item: T) => void) {
  while (node) {
    callback(node);
    node = node.next;
  }
}

export function forEachPrev<T extends Linkable<T>>(node: T | null, callback: (item: T) => void) {
  while (node) {
    callback(node);
    node = node.prev;
  }
}

// // Traversing the list
// function *forward<T extends Linkable<T>>(node?: T) {
//   for (; node; node = node.next) {
//     yield node;
//   }
// }

// function *backward<T extends Linkable<T>>(node?: T) {
//   for (; node; node = node.prev) {
//     yield node;
//   }
// }

// // Testing
// class ATest implements Linkable<ATest> {
//   next?: ATest;
//   prev?: ATest;
//   list?: List<ATest>;
//   constructor(public id: number) { }
// }
// console.log('Expect 2 1 0');
// for (const node of backward(connect(new ATest(0), new ATest(1), new ATest(2)).tail)) {
//   console.log(node.id);
// }

// class Test implements ILinkable {
//   constructor(public data: number) { }
//   next?: Test;
//   prev?: Test;
//   list?: List<Test>;

//   collect() {
//     const data: number[] = [];
//     for (let node: Nullable<Test> = this; node; node = node.next) {
//       data.push(node.data);
//     }
//     return data;
//   }
// }

// interface ITest extends Linkable<ITest> {
//   data: number;
// }

// function collect(node?: ITest) {
//   const data: number[] = [];
//   for (; node; node = node.next) {
//     data.push(node.data);
//   }
//   return data;
// }

// const a = new Test(0);
// const b = new Test(1);
// const c = new Test(2);
// const d = new Test(3);

// console.log('Expect undefined:', a.list);
// console.log('Expect [0]', a.collect());
// append(a, b);
// console.log('Expect 2:', a.list?.length);
// console.log('Expect 2:', b.list?.length);
// console.log('Expect true:', b.list === a.list);
// console.log('Expect [0,1]', a.collect());
// console.log('Expect [1]', b.collect());
// console.log('Expect [0,1]', b.list?.head.collect());
// prepend(a, c);
// console.log('Expect 3:', a.list?.length);
// console.log('Expect 3:', b.list?.length);
// console.log('Expect 3:', c.list?.length);
// console.log('Expect true:', b.list === a.list);
// console.log('Expect true:', b.list === c.list);
// console.log('Expect [0,1]', a.collect());
// console.log('Expect [1]', b.collect());
// console.log('Expect [2,0,1]', b.list?.head.collect());
// append(d, a);
// console.log('Expect 2:', a.list?.length);
// console.log('Expect 2:', b.list?.length);
// console.log('Expect 2:', c.list?.length);
// console.log('Expect false:', b.list === a.list);
// console.log('Expect true:', b.list === c.list);
// console.log('Expect [0]', a.collect());
// console.log('Expect [3,0]', d.collect());
// console.log('Expect [1]', b.collect());
// console.log('Expect [2,1]', b.list?.head.collect());

// const t1: ITest = { data: 10 };
// const t2: ITest = { data: 20 };
// const t4: ITest = { data: 40 };
// connect(t1, t2, { data: 30 }, t4);
// console.log('Expect 10 20 30 40');
// for (const t of forward(t1)) {
//   console.log(t.data);
// }
// prepend(t1, t2);
// console.log('Expect 20 10 30 40');
// for (const t of forward(t2)) {
//   console.log(t.data);
// }
// console.log('Expect 40 30 10 20');
// for (const t of backward(t4)) {
//   console.log(t.data);
// }
