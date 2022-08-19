import { graphType } from "types/graphType";
import type { Id } from "types/id";
import type { PropertyGraphEdge } from "./propertyGraphEdge";
import type { PropertyGraphNode } from "./propertyGraphNode";

export interface PropertyGraph {
  type: graphType;

  nodes: Map<Id, PropertyGraphNode>;
  edges: Map<Id, PropertyGraphEdge>;

  emptyGraph(): void;

  addNode(node: PropertyGraphNode): void;
  addEdge(edge: PropertyGraphEdge): void;
}

class HiddenPropertyGraph implements PropertyGraph {
  type: graphType;

  nodes: Map<Id, PropertyGraphNode>;
  edges: Map<Id, PropertyGraphEdge>;

  constructor(type: graphType) {
    this.type = type;
    this.emptyGraph();
  }

  public emptyGraph() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  public addNode(node: PropertyGraphNode) {
    this.nodes.set(node.id, node);
  }

  public addEdge(edge: PropertyGraphEdge) {
    this.edges.set(edge.id, edge);
  }
}

export const propertyGraphService = {
  data: new HiddenPropertyGraph(graphType.data),
  induced: new HiddenPropertyGraph(graphType.induced),
  schema: new HiddenPropertyGraph(graphType.schema),
};
