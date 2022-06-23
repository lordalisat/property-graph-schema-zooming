import { SimpleGraphNode } from "./simpleGraphElement";
import { Id } from "types/id";
import { Label } from "types/label";
import { NodeType } from "types/simpleGraph/nodeType";
import { EdgeType } from "types/simpleGraph/edgesType";

export class SimpleGraphLabelNode extends SimpleGraphNode {
    protected nodeType = NodeType.label;
    protected label: Label;
    protected incomingEdges: EdgeType;
    protected outgoingEdges: EdgeType;

    constructor(args: {nodeId: Id}) {
        super();
        Object.assign(this, args);
    }

    public getIncomingEdges(): EdgeType {
        return this.incomingEdges;
    }

    public getOutgoingEdges(): EdgeType {
        return this.outgoingEdges;
    }

    public addIncomingEdge(nodeId: Id) {
        this.incomingEdges.add({nodeId: nodeId, edgeLabel: "label"});
    }
    
    public addOutgoingEdge(nodeId: string) {
        throw new Error("Label nodes can not have Outgoing Edges");
    }
}