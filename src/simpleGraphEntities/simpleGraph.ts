import { graphType } from "types/graphType";
import type { Id } from "types/id";
import type { SimpleGraphEdgeEdge, SimpleGraphLabelEdge, SimpleGraphPropertyEdge } from "./simpleGraphEdge";
import type { SimpleGraphEdgeNode, SimpleGraphLabelNode, SimpleGraphNodeNode, SimpleGraphNodeType, SimpleGraphPropertyNode } from "./simpleGraphNode";

export interface SimpleGraph {
  type: graphType;

  nodeNodes: Map<Id, SimpleGraphNodeNode>;
  edgeNodes: Map<Id, SimpleGraphEdgeNode>;
  labelNodes: Map<Id, SimpleGraphLabelNode>;
  propertyNodes: Map<Id, SimpleGraphPropertyNode>;

  labelEdges: Array<SimpleGraphLabelEdge>;
  propertyEdges: Array<SimpleGraphPropertyEdge>;
  edgeEdges: Array<SimpleGraphEdgeEdge>;

  getNode(id: Id): SimpleGraphNodeType;

  emptyGraph(): void;

  addNodeNode(node: SimpleGraphNodeNode): void;
  addNodeNodes(nodes: SimpleGraphNodeNode[]): void;
  addEdgeNode(node: SimpleGraphEdgeNode): void;
  addEdgeNodes(nodes: SimpleGraphEdgeNode[]): void;
  addLabelNode(node: SimpleGraphLabelNode): void;
  addLabelNodes(nodes: SimpleGraphLabelNode[]): void;
  addPropertyNode(node: SimpleGraphPropertyNode): void;
  addPropertyNodes(nodes: SimpleGraphPropertyNode[]): void;
  addLabelEdge(edge: SimpleGraphLabelEdge): void;
  addLabelEdges(edges: SimpleGraphLabelEdge[]): void;
  addPropertyEdge(edge: SimpleGraphPropertyEdge): void;
  addPropertyEdges(edges: SimpleGraphPropertyEdge[]): void;
  addEdgeEdge(edge: SimpleGraphEdgeEdge): void;
  addEdgeEdges(edges: SimpleGraphEdgeEdge[]): void;
}

class HiddenSimpleGraph implements SimpleGraph {
  type: graphType;

  nodeNodes: Map<Id, SimpleGraphNodeNode>;
  edgeNodes: Map<Id, SimpleGraphEdgeNode>;
  labelNodes: Map<Id, SimpleGraphLabelNode>;
  propertyNodes: Map<Id, SimpleGraphPropertyNode>;

  labelEdges: Array<SimpleGraphLabelEdge>;
  propertyEdges: Array<SimpleGraphPropertyEdge>;
  edgeEdges: Array<SimpleGraphEdgeEdge>;

  constructor(type: graphType) {
    this.type = type;
    this.emptyGraph();
  }

  public getNode(id: Id) {
    return this.nodeNodes.get(id) ?? this.edgeNodes.get(id) ?? this.labelNodes.get(id) ?? this.propertyNodes.get(id);
  }

  public emptyGraph() {
    this.nodeNodes = new Map();
    this.edgeNodes = new Map();
    this.labelNodes = new Map();
    this.propertyNodes = new Map();

    this.labelEdges = [];
    this.propertyEdges = [];
    this.edgeEdges = [];
  }

  public addNodeNode(node: SimpleGraphNodeNode) {
    this.nodeNodes.set(node.id, node);
  }

  public addNodeNodes(nodes: SimpleGraphNodeNode[]) {
    nodes.forEach((node) => this.addNodeNode(node));
  }

  public addEdgeNode(node: SimpleGraphEdgeNode) {
    this.edgeNodes.set(node.id, node);
  }

  public addEdgeNodes(nodes: SimpleGraphEdgeNode[]) {
    nodes.forEach((node) => this.addEdgeNode(node));
  }

  public addLabelNode(node: SimpleGraphLabelNode) {
    this.labelNodes.set(node.id, node);
  }

  public addLabelNodes(nodes: SimpleGraphLabelNode[]) {
    nodes.forEach((node) => this.addLabelNode(node));
  }

  public addPropertyNode(node: SimpleGraphPropertyNode) {
    this.propertyNodes.set(node.id, node);
  }

  public addPropertyNodes(nodes: SimpleGraphPropertyNode[]) {
    nodes.forEach((node) => this.addPropertyNode(node));
  }

  public addLabelEdge(edge: SimpleGraphLabelEdge) {
    this.labelEdges.push(edge);
  }

  public addLabelEdges(edges: SimpleGraphLabelEdge[]) {
    this.labelEdges.push(...edges);
  }

  public addPropertyEdge(edge: SimpleGraphPropertyEdge) {
    this.propertyEdges.push(edge);
  }

  public addPropertyEdges(edges: SimpleGraphPropertyEdge[]) {
    this.propertyEdges.push(...edges);
  }

  public addEdgeEdge(edge: SimpleGraphEdgeEdge) {
    this.edgeEdges.push(edge);
  }

  public addEdgeEdges(edges: SimpleGraphEdgeEdge[]) {
    this.edgeEdges.push(...edges);
  }
}

export const simpleGraphService: {
  data: SimpleGraph;
  induced: SimpleGraph;
  schema: SimpleGraph;
} = {
  data: new HiddenSimpleGraph(graphType.data),
  induced: new HiddenSimpleGraph(graphType.induced),
  schema: new HiddenSimpleGraph(graphType.schema),
};
