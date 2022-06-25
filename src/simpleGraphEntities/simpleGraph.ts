import { Id } from "types/id";
import { SimpleGraphEdgeNode } from "./simpleGraphEdgeNode";
import { SimpleGraphLabelNode } from "./simpleGraphLabelNode";
import { SimpleGraphNodeNode } from "./simpleGraphNodeNode";
import { SimpleGraphPropertyNode } from "./simpleGraphPropertyNode";

abstract class SimpleGraph {
    protected static _instance: SimpleGraph;
    nodes: Map<Id, SimpleGraphNodeNode>;
    edges: Map<Id, SimpleGraphEdgeNode>;
    labels: Map<Id, SimpleGraphLabelNode>;
    properties: Map<Id, SimpleGraphPropertyNode>;

    protected constructor() {};
}

export class DataSimpleGraph extends SimpleGraph {
    public static get instance(): DataSimpleGraph {
        if (!DataSimpleGraph._instance) {
            DataSimpleGraph._instance = new DataSimpleGraph();
        }

        return DataSimpleGraph._instance;
    }
}

export class InducedSimpleGraph extends SimpleGraph {
    public static get instance(): InducedSimpleGraph {
        if (!InducedSimpleGraph._instance) {
            InducedSimpleGraph._instance = new InducedSimpleGraph();
        }

        return InducedSimpleGraph._instance;
    }
}

export class SchemaSimpleGraph extends SimpleGraph {
    public static get instance(): SchemaSimpleGraph {
        if (!SchemaSimpleGraph._instance) {
            SchemaSimpleGraph._instance = new SchemaSimpleGraph();
        }

        return SchemaSimpleGraph._instance;
    }
}