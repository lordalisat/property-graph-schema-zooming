import type { Id } from "types/id";
import { PropertyGraphEdge } from "./propertyGraphEdge";
import { PropertyGraphNode } from "./propertyGraphNode";

export class PropertyGraph {
  nodes: Map<Id, PropertyGraphNode>;
  edges: Map<Id, PropertyGraphEdge>;

  constructor() {
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

  static fromJSON(json: string): PropertyGraph {
    const graph = new PropertyGraph();
    try {
      const obj = JSON.parse(json);
      graph.nodes = obj.nodes.map((node) => {
        const nodeObj = PropertyGraphNode.fromJSON(node);
        return [nodeObj.id, nodeObj];
      })
      graph.edges = obj.edges.map((edge) => {
        const edgeObj = PropertyGraphEdge.fromJSON(edge);
        if (!graph.nodes.has(edgeObj.sourceNode)) {
          throw new Error("Edge needs valid source");
        }
        if (!graph.nodes.has(edgeObj.targetNode)) {
          throw new Error("Edge needs valid target");
        }
        return [edgeObj.id, edgeObj];
      })
    }
    catch (error) {
      console.error("Invalid JSON: ", error);
      return;
    }
  }

  public toJSON(): string {
    return JSON.stringify({
      nodes: [...this.nodes.values()].map((node) => {
        return node.toJSON();
      }),
      edges: [...this.edges.values()].map((edge) => {
        return edge.toJSON();
      })
    });
  }
}
