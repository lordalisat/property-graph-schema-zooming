import type { Property } from "../types/property";
import type { EdgeDirection, EdgeLabel } from "../types/simpleGraph/edgeLabel";
import { EdgeType } from "../types/simpleGraph/edgeType";
import type { SimpleGraphEdgeNode, SimpleGraphLabelNode, SimpleGraphNode, SimpleGraphNodeNode, SimpleGraphNodeType, SimpleGraphPropertyNode } from "./simpleGraphNode";

export interface SimpleGraphEdgeType {
  source: SimpleGraphNodeType;
  target: SimpleGraphNodeType;
  label: EdgeLabel;
  type: EdgeType;
}
export type SimpleGraphLabelEdge = SimpleGraphEdgeType;
export type SimpleGraphPropertyEdge = SimpleGraphEdgeType;
export type SimpleGraphEdgeEdge = SimpleGraphEdgeType;

export class SimpleGraphEdge {
  static labelEdge(
    sourceNode: SimpleGraphNodeNode | SimpleGraphEdgeNode,
    targetNode: SimpleGraphLabelNode
  ): SimpleGraphLabelEdge {
    return {
      source: sourceNode,
      target: targetNode,
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
      source: sourceNode,
      target: targetNode,
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
      source: sourceNode,
      target: targetNode,
      label: direction,
      type: EdgeType.edge,
    } as SimpleGraphEdgeEdge;
  }
}
