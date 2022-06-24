import { SimpleGraphNode } from "./simpleGraphElement";
import { Id } from "types/id";
import { Label } from "types/label";
import { NodeType } from "types/simpleGraph/nodeType";
import { EdgeDirection, EdgeLabel, ValueType } from "types/simpleGraph/edgeLabel";
import { Property } from "types/property";

export class SimpleGraphEdgeNode extends SimpleGraphNode {
    nodeType = NodeType.edge;
    label = "edge";

    constructor(args: {nodeId: Id}) {
        super();
        Object.assign(this, args);
    }

    public addEdgeEdge(nodeId: Id, direction: EdgeDirection) {
        this.addOutgoingEdge(nodeId, direction);
    }

    public addPropertyEdge(property: Property, propertyType: ValueType) {
        this.addOutgoingEdge(property, propertyType);
    }

    public addLabelEdge(label: Label) {
        this.addOutgoingEdge(label, "label");
    }
}