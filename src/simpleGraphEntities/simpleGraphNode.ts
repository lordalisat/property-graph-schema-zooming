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
    this: new () => SimpleGraphNodeNode,
    id: Id
  ): SimpleGraphNodeNode {
    return Object.assign(new this(), {
      id: toSimpleId(NodeType.node, id),
      label: "node",
      type: NodeType.node,
    }) as SimpleGraphNodeNode;
  }

  static edgeNode(
    this: new () => SimpleGraphEdgeNode,
    id: Id
  ): SimpleGraphEdgeNode {
    return Object.assign(new this(), {
      id: toSimpleId(NodeType.edge, id),
      label: "node",
      type: NodeType.edge,
    }) as SimpleGraphEdgeNode;
  }

  static labelNode(
    this: new () => SimpleGraphPropertyNode,
    label: Label
  ): SimpleGraphPropertyNode {
    return Object.assign(new this(), {
      id: toSimpleId(NodeType.label, label),
      label: label,
      type: NodeType.label,
    }) as SimpleGraphPropertyNode;
  }

  static propertyNode(
    this: new () => SimpleGraphLabelNode,
    propertyType: PropertyType
  ): SimpleGraphLabelNode {
    return Object.assign(new this(), {
      id: toSimpleId(NodeType.propertyType, propertyType.toString()),
      label: propertyType,
      type: NodeType.propertyType,
    }) as SimpleGraphLabelNode;
  }
}
