import { type SimpleId, type Id, toSimpleId } from "types/id";
import type { Label } from "types/label";
import type { PropertyType } from "types/property";
import { NodeType } from "types/simpleGraph/nodeType";

export interface SimpleGraphNodeType {
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  id: SimpleId;
  label: Label;
  type: NodeType;
}

export type SimpleGraphNodeNode = SimpleGraphNodeType;
export type SimpleGraphEdgeNode = SimpleGraphNodeType;
export type SimpleGraphPropertyNode = SimpleGraphNodeType;
export type SimpleGraphLabelNode = SimpleGraphNodeType;

export class SimpleGraphNode {
  static nodeNode(id: Id, x?: number, y?: number): SimpleGraphNodeNode {
    return {
      id: toSimpleId(NodeType.node, id),
      label: "node",
      type: NodeType.node,
      x,
      y,
    } as SimpleGraphNodeNode;
  }

  static edgeNode(id: Id, x?: number, y?: number): SimpleGraphEdgeNode {
    return {
      id: toSimpleId(NodeType.edge, id),
      label: "edge",
      type: NodeType.edge,
      x,
      y,
    } as SimpleGraphEdgeNode;
  }

  static labelNode(label: Label, x?: number, y?: number): SimpleGraphPropertyNode {
    return {
      id: toSimpleId(NodeType.label, label),
      label: label,
      type: NodeType.label,
      x,
      y,
    } as SimpleGraphPropertyNode;
  }

  static propertyNode(propertyType: PropertyType, x?: number, y?: number): SimpleGraphLabelNode {
    return {
      id: toSimpleId(NodeType.propertyType, propertyType.toString()),
      label: propertyType.toString(),
      type: NodeType.propertyType,
      x,
      y,
    } as SimpleGraphLabelNode;
  }
}
