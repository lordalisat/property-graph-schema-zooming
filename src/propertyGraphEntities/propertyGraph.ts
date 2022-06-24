import { Id } from "types/id";
import { PropertyGraphEdge } from "./propertyGraphEdge";
import { PropertyGraphNode } from "./propertyGraphNode";

export class PropertyGraph {
    private static instance: PropertyGraph;
    nodes: Map<Id, PropertyGraphNode>;
    edges: Map<Id, PropertyGraphEdge>;

    private constructor() {};

    public static getInstance(): PropertyGraph {
        if (!PropertyGraph.instance) {
            PropertyGraph.instance = new PropertyGraph();
        }

        return PropertyGraph.instance;
    }


}