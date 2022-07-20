import { Id, SimpleId, toSimpleId } from "types/id";
import { NodeType } from "types/simpleGraph/nodeType";
import { Label } from "types/label";
import { PropertyType } from "types/property";

export interface SimpleGraphNodeType {
  id: SimpleId;
  label: Label;
  type: NodeType;
}

export type SimpleGraphNodeNode = SimpleGraphNodeType;
export type SimpleGraphEdgeNode = SimpleGraphNodeType;
export type SimpleGraphPropertyNode = SimpleGraphNodeType;
export type SimpleGraphLabelNode = SimpleGraphNodeType;

export class SimpleGraphNode implements SimpleGraphNodeType {
  readonly id!: SimpleId;
  readonly label!: Label;
  readonly type!: NodeType;

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
      label: "node",
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
