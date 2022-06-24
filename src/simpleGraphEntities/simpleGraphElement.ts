import { EdgeType } from "types/simpleGraph/edgesType";
import { Id } from "types/id";
import { NodeType } from "types/simpleGraph/nodeType";
import { EdgeLabel } from "types/simpleGraph/edgeLabel";
import { Label } from "types/label";

export abstract class SimpleGraphNode {
    readonly nodeId!: Id;
    readonly label!: Label;
    protected nodeType!: NodeType;
    protected _incomingEdges: EdgeType;
    protected _outgoingEdges: EdgeType;

    public get incomingEdges(): EdgeType {
        return this._incomingEdges;
    }
    public get outgoingEdges(): EdgeType {
        return this._outgoingEdges;
    }

    public addIncomingEdge(nodeId: Id, edgeLabel: EdgeLabel) {
        this.incomingEdges.push({nodeId: nodeId, edgeLabel: edgeLabel});
    }
    
    public addOutgoingEdge(nodeId: Id, edgeLabel: EdgeLabel) {
        this.outgoingEdges.push({nodeId: nodeId, edgeLabel: edgeLabel});
    }
}