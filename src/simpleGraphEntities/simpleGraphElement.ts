import { EdgeType } from "types/simpleGraph/edgesType";
import { Id } from "types/id";
import { NodeType } from "types/simpleGraph/nodeType";
import { EdgeLabel } from "types/simpleGraph/edgeLabel";

export abstract class SimpleGraphNode {
    protected nodeId!: Id;
    protected nodeType!: NodeType;
    protected abstract incomingEdges?: EdgeType;
    protected abstract outgoingEdges?: EdgeType;

    public abstract getIncomingEdges?(): EdgeType;
    public abstract getOutgoingEdges?(): EdgeType;

    abstract addIncomingEdge?(nodeId: Id, edgeLabel?: EdgeLabel): void;
    
    abstract addOutgoingEdge?(nodeId: Id, edgeLabel?: EdgeLabel): void;
}