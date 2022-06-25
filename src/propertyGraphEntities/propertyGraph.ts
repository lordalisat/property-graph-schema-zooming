import { Id } from "types/id";
import { PropertyGraphEdge } from "./propertyGraphEdge";
import { PropertyGraphNode } from "./propertyGraphNode";

abstract class PropertyGraph {
    nodes: Map<Id, PropertyGraphNode>;
    edges: Map<Id, PropertyGraphEdge>;

    protected constructor() {};

    public addNode(node: PropertyGraphNode) {
        this.nodes.set(node.id, node);
    }

    public addEdge(edge: PropertyGraphEdge) {
        this.edges.set(edge.id, edge);
    }
}

export class DataPropertyGraph extends PropertyGraph {
    private static _instance: DataPropertyGraph;

    public static get instance(): DataPropertyGraph {
        if (!DataPropertyGraph._instance) {
            DataPropertyGraph._instance = new DataPropertyGraph();
        }

        return DataPropertyGraph._instance;
    }
}

export class InducedPropertyGraph extends PropertyGraph {
    private static _instance: InducedPropertyGraph;

    public static get instance(): InducedPropertyGraph {
        if (!InducedPropertyGraph._instance) {
            InducedPropertyGraph._instance = new InducedPropertyGraph();
        }

        return InducedPropertyGraph._instance;
    }
}

export class SchemaPropertyGraph extends PropertyGraph {
    private static _instance: SchemaPropertyGraph;

    public static get instance(): SchemaPropertyGraph {
        if (!SchemaPropertyGraph._instance) {
            SchemaPropertyGraph._instance = new SchemaPropertyGraph();
        }

        return SchemaPropertyGraph._instance;
    }
}

