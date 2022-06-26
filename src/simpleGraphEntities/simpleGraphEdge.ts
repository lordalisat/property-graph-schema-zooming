import { Property } from "types/property";
import { EdgeDirection, EdgeLabel } from "types/simpleGraph/edgeLabel";
import {
  SimpleGraphEdgeNode,
  SimpleGraphLabelNode,
  SimpleGraphNode,
  SimpleGraphNodeNode,
  SimpleGraphPropertyNode,
} from "./simpleGraphNode";

export abstract class SimpleGraphEdge {
  abstract readonly startNode: SimpleGraphNode;
  abstract readonly endNode: SimpleGraphNode;
  readonly label!: EdgeLabel;
}

export class SimpleGraphLabelEdge extends SimpleGraphEdge {
  readonly startNode: SimpleGraphNodeNode | SimpleGraphEdgeNode;
  readonly endNode: SimpleGraphLabelNode;

  constructor(
    startNode: SimpleGraphNodeNode | SimpleGraphEdgeNode,
    endNode: SimpleGraphLabelNode
  ) {
    super();
    Object.assign(this, {
      startNode: startNode,
      endNode: endNode,
      label: "label",
    });
  }
}

export class SimpleGraphPropertyEdge extends SimpleGraphEdge {
  readonly startNode: SimpleGraphNodeNode | SimpleGraphEdgeNode;
  readonly endNode: SimpleGraphPropertyNode;
  constructor(
    startNode: SimpleGraphNodeNode | SimpleGraphEdgeNode,
    endNode: SimpleGraphPropertyNode,
    property: Property
  ) {
    super();
    Object.assign(this, {
      startNode: startNode,
      endNode: endNode,
      label: property,
    });
  }
}

export class SimpleGraphEdgeEdge extends SimpleGraphEdge {
  readonly startNode: SimpleGraphEdgeNode;
  readonly endNode: SimpleGraphNodeNode;
  constructor(
    startNode: SimpleGraphEdgeNode,
    endNode: SimpleGraphNodeNode,
    direction: EdgeDirection
  ) {
    super();
    Object.assign(this, {
      startNode: startNode,
      endNode: endNode,
      label: direction,
    });
  }
}
