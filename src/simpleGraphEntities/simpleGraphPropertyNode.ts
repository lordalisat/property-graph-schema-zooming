import { SimpleGraphNode } from "./simpleGraphElement";
import { Id } from "types/id";
import { Label } from "types/label";
import { NodeType } from "types/simpleGraph/nodeType";
import { EdgeType } from "types/simpleGraph/edgesType";
import { EdgeLabel } from "types/simpleGraph/edgeLabel";

export class SimpleGraphPropertyNode extends SimpleGraphNode {
    nodeType = NodeType.propertyType;

    constructor(args: {nodeId: Id, label: Label}) {
        super();
        Object.assign(this, args);
    }

    public addIncomingEdge(nodeId: Id, edgeLabel: EdgeLabel): void {
        this.incomingEdges.add({nodeId: nodeId, edgeLabel: edgeLabel});
    }
    
    public addOutgoingEdge(nodeId: Id, edgeLabel: EdgeLabel) {
        throw new Error("Property nodes can not have Outgoing Edges");
    }
}