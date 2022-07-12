import { induceWorkload, InductionMethod } from "functions/workloadInduction";
import { Workload } from "types/workload";
import { SimpleGraphEdge, SimpleGraphEdgeEdge, SimpleGraphLabelEdge, SimpleGraphPropertyEdge } from "./simpleGraphEdge";
import {
  SimpleGraphEdgeNode,
  SimpleGraphLabelNode,
  SimpleGraphNodeNode,
  SimpleGraphPropertyNode,
} from "./simpleGraphNode";

abstract class SimpleGraph {
  nodeNodes: Array<SimpleGraphNodeNode>;
  edgeNodes: Array<SimpleGraphEdgeNode>;
  labelNodes: Array<SimpleGraphLabelNode>;
  propertyNodes: Array<SimpleGraphPropertyNode>;

  labelEdges: Array<SimpleGraphLabelEdge>;
  propertyEdges: Array<SimpleGraphPropertyEdge>;
  edgeEdges: Array<SimpleGraphEdgeEdge>;

  protected constructor() {
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

export class DataSimpleGraph extends SimpleGraph {
  private static _instance: DataSimpleGraph;

  public static get instance(): DataSimpleGraph {
    if (!DataSimpleGraph._instance) {
      DataSimpleGraph._instance = new DataSimpleGraph();
    }

    return DataSimpleGraph._instance;
  }

  public induceWorkload(workload: Workload, inductionMethod: InductionMethod) {
    return induceWorkload(this, workload, inductionMethod);
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
