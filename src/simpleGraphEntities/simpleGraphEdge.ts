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
export interface SimpleGraphLabelEdge extends SimpleGraphEdgeType {}
export interface SimpleGraphPropertyEdge extends SimpleGraphEdgeType {}
export interface SimpleGraphEdgeEdge extends SimpleGraphEdgeType {}

export class SimpleGraphEdge {
  static labelEdge(
    this: new () => SimpleGraphLabelEdge,
    data: {
      startNode: SimpleGraphNodeNode | SimpleGraphEdgeNode;
      endNode: SimpleGraphLabelNode;
    }
  ): SimpleGraphLabelEdge {
    return Object.assign(new this(), {
      startNode: data.startNode,
      endNode: data.endNode,
      label: "label",
      type: EdgeType.label,
    });
  }

  static propertyEdge(
    this: new () => SimpleGraphPropertyEdge,
    data: {
      startNode: SimpleGraphNodeNode | SimpleGraphEdgeNode;
      endNode: SimpleGraphPropertyNode;
      property: Property;
    }
  ): SimpleGraphPropertyEdge {
    return Object.assign(new this(), {
      startNode: data.startNode,
      endNode: data.endNode,
      label: data.property,
      type: EdgeType.property,
    });
  }

  static edgeEdge(
    this: new () => SimpleGraphEdgeEdge,
    data: {
      startNode: SimpleGraphEdgeNode;
      endNode: SimpleGraphNodeNode;
      direction: EdgeDirection;
    }
  ): SimpleGraphEdgeEdge {
    return Object.assign(new this(), {
      startNode: data.startNode,
      endNode: data.endNode,
      label: data.direction,
      type: EdgeType.edge,
    });
  }
}
