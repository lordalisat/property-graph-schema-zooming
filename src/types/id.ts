import { NodeType } from "./simpleGraph/nodeType";

export type Id = string;

export type SimpleId = `${NodeType}_${Id}`;

export function toSimpleId(nodeType: NodeType, id: Id): SimpleId {
  return `${nodeType}_${id}`;
}

export function fromSimpleId(id: SimpleId): Id {
  return id.split("_").slice(1).join("_");
}
