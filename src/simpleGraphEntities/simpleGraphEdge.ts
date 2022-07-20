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
    sourceNode: SimpleGraphNodeNode | SimpleGraphEdgeNode,
    targetNode: SimpleGraphLabelNode
  ): SimpleGraphLabelEdge {
    return {
      sourceNode: sourceNode,
      targetNode: targetNode,
      label: "label",
      type: EdgeType.label,
    } as SimpleGraphLabelEdge;
  }

  static propertyEdge(
    sourceNode: SimpleGraphNodeNode | SimpleGraphEdgeNode,
    targetNode: SimpleGraphPropertyNode,
    property: Property
  ): SimpleGraphPropertyEdge {
    return {
      sourceNode: sourceNode,
      targetNode: targetNode,
      label: property,
      type: EdgeType.property,
    } as SimpleGraphPropertyEdge;
  }

  static edgeEdge(
    sourceNode: SimpleGraphEdgeNode,
    targetNode: SimpleGraphNodeNode,
    direction: EdgeDirection
  ): SimpleGraphEdgeEdge {
    return {
      sourceNode: sourceNode,
      targetNode: targetNode,
      label: direction,
      type: EdgeType.edge,
    } as SimpleGraphEdgeEdge;
  }
}
