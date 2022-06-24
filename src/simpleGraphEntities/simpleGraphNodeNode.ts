import { SimpleGraphNode } from "./simpleGraphElement";
import { Id } from "types/id";
import { Label } from "types/label";
import { NodeType } from "types/simpleGraph/nodeType";
import { EdgeType } from "types/simpleGraph/edgesType";
import { EdgeDirection, EdgeLabel, ValueType } from "types/simpleGraph/edgeLabel";
import { Property } from "types/property";

export class SimpleGraphNodeNode extends SimpleGraphNode {
    nodeType = NodeType.node;
    label = "node";

    constructor(args: {nodeId: Id}) {
        super();
        Object.assign(this, args);
    }

    public addIncomingEdge(nodeId: Id, edgeLabel: EdgeLabel) {
        this.incomingEdges.add({nodeId: nodeId, edgeLabel: edgeLabel});
    }
    
    public addOutgoingEdge(nodeId: Id, edgeLabel: EdgeLabel) {
        this.outgoingEdges.add({nodeId: nodeId, edgeLabel: edgeLabel});
    }

    public addEdgeEdge(edgeId: Id, direction: EdgeDirection) {
        this.addIncomingEdge(edgeId, direction);
    }

    public addPropertyEdge(property: Property, propertyType: ValueType) {
        this.addOutgoingEdge(property, propertyType);
    }

    public addLabelEdge(label: Label) {
        this.addOutgoingEdge(label, "label");
    }
}