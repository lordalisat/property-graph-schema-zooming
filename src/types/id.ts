import { NodeType } from "./simpleGraph/nodeType";

export type Id = string;

export type SimpleId = `${NodeType}_${Id}`;

export function toSimpleId(nodeType: NodeType, id: Id): SimpleId {
  return `${nodeType}_${id}`;
}
