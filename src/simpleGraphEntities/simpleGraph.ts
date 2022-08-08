import { graphType } from "types/graphType";
import type { SimpleGraphEdgeEdge, SimpleGraphLabelEdge, SimpleGraphPropertyEdge } from "./simpleGraphEdge";
import type { SimpleGraphEdgeNode, SimpleGraphLabelNode, SimpleGraphNodeNode, SimpleGraphPropertyNode } from "./simpleGraphNode";

export interface SimpleGraph {
  type: graphType;

  nodeNodes: Array<SimpleGraphNodeNode>;
  edgeNodes: Array<SimpleGraphEdgeNode>;
  labelNodes: Array<SimpleGraphLabelNode>;
  propertyNodes: Array<SimpleGraphPropertyNode>;

  labelEdges: Array<SimpleGraphLabelEdge>;
  propertyEdges: Array<SimpleGraphPropertyEdge>;
  edgeEdges: Array<SimpleGraphEdgeEdge>;

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

  nodeNodes: Array<SimpleGraphNodeNode>;
  edgeNodes: Array<SimpleGraphEdgeNode>;
  labelNodes: Array<SimpleGraphLabelNode>;
  propertyNodes: Array<SimpleGraphPropertyNode>;

  labelEdges: Array<SimpleGraphLabelEdge>;
  propertyEdges: Array<SimpleGraphPropertyEdge>;
  edgeEdges: Array<SimpleGraphEdgeEdge>;

  constructor(type: graphType) {
    this.type = type;
    this.emptyGraph();
  }

  public emptyGraph() {
    this.nodeNodes = [];
    this.edgeNodes = [];
    this.labelNodes = [];
    this.propertyNodes = [];

    this.labelEdges = [];
    this.propertyEdges = [];
    this.edgeEdges = [];
  }

  public addNodeNode(node: SimpleGraphNodeNode) {
    this.nodeNodes.push(node);
  }

  public addNodeNodes(nodes: SimpleGraphNodeNode[]) {
    this.nodeNodes.push(...nodes);
  }

  public addEdgeNode(node: SimpleGraphEdgeNode) {
    this.edgeNodes.push(node);
  }

  public addEdgeNodes(nodes: SimpleGraphEdgeNode[]) {
    this.edgeNodes.push(...nodes);
  }

  public addLabelNode(node: SimpleGraphLabelNode) {
    this.labelNodes.push(node);
  }

  public addLabelNodes(nodes: SimpleGraphLabelNode[]) {
    this.labelNodes.push(...nodes);
  }

  public addPropertyNode(node: SimpleGraphPropertyNode) {
    this.propertyNodes.push(node);
  }

  public addPropertyNodes(nodes: SimpleGraphPropertyNode[]) {
    this.propertyNodes.push(...nodes);
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
