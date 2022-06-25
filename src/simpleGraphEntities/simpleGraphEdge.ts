import { Property } from "types/property";
import { EdgeDirection, EdgeLabel } from "types/simpleGraph/edgeLabel";
import { SimpleGraphEdgeNode, SimpleGraphLabelNode, SimpleGraphNode, SimpleGraphNodeNode, SimpleGraphPropertyNode } from "./simpleGraphNode";

abstract class SimpleGraphEdge {
    readonly startNode!: SimpleGraphNode;
    readonly endNode!: SimpleGraphNode;
    readonly label!: EdgeLabel;
}

export class SimpleGraphLabelEdge extends SimpleGraphEdge {
    constructor(startNode: SimpleGraphNodeNode | SimpleGraphEdgeNode, endNode: SimpleGraphLabelNode) {
        super();
        Object.assign(this, {startNode: startNode, endNode: endNode, label: "label"});
    }
}

export class SimpleGraphPropertyEdge extends SimpleGraphEdge {
    constructor(startNode: SimpleGraphNodeNode | SimpleGraphEdgeNode, endNode: SimpleGraphPropertyNode, property: Property) {
        super();
        Object.assign(this, {startNode: startNode, endNode: endNode, label: property});
    }
}

export class SimpleGraphEdgeEdge extends SimpleGraphEdge {
    constructor(startNode: SimpleGraphEdgeNode, endNode: SimpleGraphNodeNode, direction: EdgeDirection) {
        super();
        Object.assign(this, {startNode: startNode, endNode: endNode, label: direction});
    }
}