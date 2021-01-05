import { PathNode, createPathNode } from './node';
import { DrawToken } from './parser';

export function getPathNodesA(tokens: DrawToken[]) {
  const path: PathNode[] = [];
  for (let i = 0; i < tokens.length; i++) {
    path[i] = createPathNode(tokens[i], path[i - 1]);
  }
  return path;
}

export function getPathNodesB(tokens: DrawToken[]) {
  let node: PathNode | undefined;
  return tokens.map(token => node = createPathNode(token, node));
}
