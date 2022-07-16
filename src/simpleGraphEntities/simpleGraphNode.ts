import { Id, SimpleId, toSimpleId } from "types/id";
import { NodeType } from "types/simpleGraph/nodeType";
import { Label } from "types/label";
import { PropertyType } from "types/property";

export interface SimpleGraphNodeType {
  id: SimpleId;
  label: Label;
  type: NodeType;
}

export type SimpleGraphNodeNode = SimpleGraphNodeType
export type SimpleGraphEdgeNode = SimpleGraphNodeType
export type SimpleGraphPropertyNode = SimpleGraphNodeType
export type SimpleGraphLabelNode = SimpleGraphNodeType

export class SimpleGraphNode {
  readonly id!: SimpleId;
  readonly label!: Label;
  readonly type!: NodeType;

  static nodeNode(
    this: new () => SimpleGraphNodeNode,
    data: { id: Id }
  ): SimpleGraphNodeNode {
    return Object.assign(new this(), {
      id: toSimpleId(NodeType.node, data.id),
      label: "node",
      type: NodeType.node,
    });
  }

  static edgeNode(
    this: new () => SimpleGraphEdgeNode,
    data: { id: Id }
  ): SimpleGraphEdgeNode {
    return Object.assign(new this(), {
      id: toSimpleId(NodeType.edge, data.id),
      label: "node",
      type: NodeType.edge,
    });
  }

  static labelNode(
    this: new () => SimpleGraphPropertyNode,
    data: { label: Label }
  ): SimpleGraphPropertyNode {
    return Object.assign(new this(), {
      id: toSimpleId(NodeType.label, data.label),
      label: data.label,
      type: NodeType.label,
    });
  }

  static propertyNode(
    this: new () => SimpleGraphLabelNode,
    data: { propertyType: PropertyType }
  ): SimpleGraphLabelNode {
    return Object.assign(new this(), {
      id: toSimpleId(NodeType.propertyType, data.propertyType.toString()),
      label: data.propertyType,
      type: NodeType.propertyType,
    });
  }
}
