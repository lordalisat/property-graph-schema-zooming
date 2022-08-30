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
    const errors = [];
    const graph = new PropertyGraph();
    const obj = JSON.parse(json);
    graph.nodes = new Map(obj.nodes.map((node) => {
      try {
        const nodeObj = PropertyGraphNode.fromJSON(node);
        return [nodeObj.id, nodeObj];
      } catch (error) {
        errors.push(error.message);
        return [];
      }
    }));
    graph.edges = new Map(obj.edges.map((edge) => {
      try {
        const edgeObj = PropertyGraphEdge.fromJSON(edge);
        if (!graph.nodes.has(edgeObj.sourceNode)) {
          errors.push(`Edge ${edgeObj.id} has invalid source ${edgeObj.sourceNode}`);
        }
        if (!graph.nodes.has(edgeObj.targetNode)) {
          errors.push(`Edge ${edgeObj.id} has invalid source ${edgeObj.targetNode}`);
        }
        return [edgeObj.id, edgeObj];
      } catch (error) {
        errors.push(error.message);
        return [];
      }
    }));
    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }
    return graph;
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
