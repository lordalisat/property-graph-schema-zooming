import { toSimpleId, type Id, type SimpleId } from "../types/id";
import type { Label } from "../types/label";
import type { PropertyType } from "../types/property";
import { NodeType } from "../types/simpleGraph/nodeType";

export interface SimpleGraphNodeType {
  x?: number;
  y?: number;
  id: SimpleId;
  label: Label;
  type: NodeType;
}

export type SimpleGraphNodeNode = SimpleGraphNodeType;
export type SimpleGraphEdgeNode = SimpleGraphNodeType;
export type SimpleGraphPropertyNode = SimpleGraphNodeType;
export type SimpleGraphLabelNode = SimpleGraphNodeType;

export class SimpleGraphNode {
  static nodeNode(
    id: Id
  ): SimpleGraphNodeNode {
    return {
      id: toSimpleId(NodeType.node, id),
      label: "node",
      type: NodeType.node,
    } as SimpleGraphNodeNode;
  }

  static edgeNode(
    id: Id
  ): SimpleGraphEdgeNode {
    return {
      id: toSimpleId(NodeType.edge, id),
      label: "edge",
      type: NodeType.edge,
    } as SimpleGraphEdgeNode;
  }

  static labelNode(
    label: Label
  ): SimpleGraphPropertyNode {
    return {
      id: toSimpleId(NodeType.label, label),
      label: label,
      type: NodeType.label,
    } as SimpleGraphPropertyNode;
  }

  static propertyNode(
    propertyType: PropertyType
  ): SimpleGraphLabelNode {
    return {
      id: toSimpleId(NodeType.propertyType, propertyType.toString()),
      label: propertyType.toString(),
      type: NodeType.propertyType,
    } as SimpleGraphLabelNode;
  }
}
