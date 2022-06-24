import { SimpleGraphNode } from "./simpleGraphElement";
import { Id } from "types/id";
import { Label } from "types/label";
import { NodeType } from "types/simpleGraph/nodeType";
import { EdgeType } from "types/simpleGraph/edgesType";

export class SimpleGraphLabelNode extends SimpleGraphNode {
    nodeType = NodeType.label;

    constructor(args: {nodeId: Id, label: Label}) {
        super();
        Object.assign(this, args);
    }

    public addIncomingEdge(nodeId: Id) {
        this.incomingEdges.add({nodeId: nodeId, edgeLabel: "label"});
    }
    
    public addOutgoingEdge(nodeId: string) {
        throw new Error("Label nodes can not have Outgoing Edges");
    }
}