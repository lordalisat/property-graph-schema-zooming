import { Id } from "types/id";
import { NodeType } from "types/simpleGraph/nodeType";
import { SimpleGraphEdgeNode } from "./simpleGraphEdgeNode";
import { SimpleGraphLabelNode } from "./simpleGraphLabelNode";
import { SimpleGraphNodeNode } from "./simpleGraphNodeNode";
import { SimpleGraphPropertyNode } from "./simpleGraphPropertyNode";

abstract class SimpleGraph {
    nodes: Map<`${NodeType}_${Id}`, SimpleGraphNodeNode>;
    edges: Map<`${NodeType}_${Id}`, SimpleGraphEdgeNode>;
    labels: Map<`${NodeType}_${Id}`, SimpleGraphLabelNode>;
    properties: Map<`${NodeType}_${Id}`, SimpleGraphPropertyNode>;

    protected constructor() {};

    public addNode(node: SimpleGraphNodeNode) {
        this.nodes.set(`${node.nodeType}_${node.nodeId}`, node)
    }

    public addEdge(node: SimpleGraphEdgeNode) {
        this.edges.set(`${node.nodeType}_${node.nodeId}`, node)
    }

    public addLabel(node: SimpleGraphLabelNode) {
        this.labels.set(`${node.nodeType}_${node.nodeId}`, node)
    }

    public addProperty(node: SimpleGraphPropertyNode) {
        this.properties.set(`${node.nodeType}_${node.nodeId}`, node)
    }
}

export class DataSimpleGraph extends SimpleGraph {
    private static _instance: DataSimpleGraph;

    public static get instance(): DataSimpleGraph {
        if (!DataSimpleGraph._instance) {
            DataSimpleGraph._instance = new DataSimpleGraph();
        }

        return DataSimpleGraph._instance;
    }
}

export class InducedSimpleGraph extends SimpleGraph {
    private static _instance: InducedSimpleGraph;

    public static get instance(): InducedSimpleGraph {
        if (!InducedSimpleGraph._instance) {
            InducedSimpleGraph._instance = new InducedSimpleGraph();
        }

        return InducedSimpleGraph._instance;
    }
}

export class SchemaSimpleGraph extends SimpleGraph {
    private static _instance: SchemaSimpleGraph;

    public static get instance(): SchemaSimpleGraph {
        if (!SchemaSimpleGraph._instance) {
            SchemaSimpleGraph._instance = new SchemaSimpleGraph();
        }

        return SchemaSimpleGraph._instance;
    }
}