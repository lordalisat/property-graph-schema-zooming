import { Id } from "types/id";
import { SimpleGraphEdgeNode } from "./simpleGraphEdgeNode";
import { SimpleGraphLabelNode } from "./simpleGraphLabelNode";
import { SimpleGraphNodeNode } from "./simpleGraphNodeNode";
import { SimpleGraphPropertyNode } from "./simpleGraphPropertyNode";

export class SimpleGraph {
    private static instance: SimpleGraph;
    nodes: Map<Id, SimpleGraphNodeNode>;
    edges: Map<Id, SimpleGraphEdgeNode>;
    labels: Map<Id, SimpleGraphLabelNode>;
    properties: Map<Id, SimpleGraphPropertyNode>;

    private constructor() {};

    public static getInstance(): SimpleGraph {
        if (!SimpleGraph.instance) {
            SimpleGraph.instance = new SimpleGraph();
        }

        return SimpleGraph.instance;
    }


}