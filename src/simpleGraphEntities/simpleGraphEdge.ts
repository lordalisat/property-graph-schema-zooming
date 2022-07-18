import { Property } from "types/property";
import { EdgeDirection, EdgeLabel } from "types/simpleGraph/edgeLabel";
import { EdgeType } from "types/simpleGraph/edgeType";
import {
  SimpleGraphEdgeNode,
  SimpleGraphLabelNode,
  SimpleGraphNode,
  SimpleGraphNodeNode,
  SimpleGraphPropertyNode,
} from "./simpleGraphNode";

export interface SimpleGraphEdgeType {
  sourceNode: SimpleGraphNode;
  targetNode: SimpleGraphNode;
  label: EdgeLabel;
  type: EdgeType;
}
export type SimpleGraphLabelEdge = SimpleGraphEdgeType;
export type SimpleGraphPropertyEdge = SimpleGraphEdgeType;
export type SimpleGraphEdgeEdge = SimpleGraphEdgeType;

export class SimpleGraphEdge implements SimpleGraphEdgeType {
  readonly sourceNode!: SimpleGraphNode;
  readonly targetNode!: SimpleGraphNode;
  readonly label!: EdgeLabel;
  readonly type!: EdgeType;

  static labelEdge(
    this: new () => SimpleGraphLabelEdge,
    sourceNode: SimpleGraphNodeNode | SimpleGraphEdgeNode,
    targetNode: SimpleGraphLabelNode
  ): SimpleGraphLabelEdge {
    return Object.assign(new this(), {
      sourceNode: sourceNode,
      targetNode: targetNode,
      label: "label",
      type: EdgeType.label,
    }) as SimpleGraphLabelEdge;
  }

  static propertyEdge(
    this: new () => SimpleGraphPropertyEdge,
    sourceNode: SimpleGraphNodeNode | SimpleGraphEdgeNode,
    targetNode: SimpleGraphPropertyNode,
    property: Property
  ): SimpleGraphPropertyEdge {
    return Object.assign(new this(), {
      sourceNode: sourceNode,
      targetNode: targetNode,
      label: property,
      type: EdgeType.property,
    }) as SimpleGraphPropertyEdge;
  }

  static edgeEdge(
    this: new () => SimpleGraphEdgeEdge,
    sourceNode: SimpleGraphEdgeNode,
    targetNode: SimpleGraphNodeNode,
    direction: EdgeDirection
  ): SimpleGraphEdgeEdge {
    return Object.assign(new this(), {
      sourceNode: sourceNode,
      targetNode: targetNode,
      label: direction,
      type: EdgeType.edge,
    }) as SimpleGraphEdgeEdge;
  }
}
