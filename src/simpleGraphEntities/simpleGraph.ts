import { induceWorkload } from "functions/workloadInduction";
import { SimpleId } from "types/id";
import { Workload } from "types/workload";
import { SimpleGraphEdge, SimpleGraphEdgeEdge, SimpleGraphLabelEdge, SimpleGraphPropertyEdge } from "./simpleGraphEdge";
import {
  SimpleGraphEdgeNode,
  SimpleGraphLabelNode,
  SimpleGraphNodeNode,
  SimpleGraphPropertyNode,
} from "./simpleGraphNode";

abstract class SimpleGraph {
  nodeNodes: Map<SimpleId, SimpleGraphNodeNode>;
  edgeNodes: Map<SimpleId, SimpleGraphEdgeNode>;
  labelNodes: Map<SimpleId, SimpleGraphLabelNode>;
  propertyNodes: Map<SimpleId, SimpleGraphPropertyNode>;

  labelEdges: Array<SimpleGraphLabelEdge>;
  propertyEdges: Array<SimpleGraphPropertyEdge>;
  edgeEdges: Array<SimpleGraphEdgeEdge>;

  protected constructor() {
    this.nodeNodes = new Map();
    this.edgeNodes = new Map();
    this.labelNodes = new Map();
    this.propertyNodes = new Map();
  }

  public addNode(node: SimpleGraphNodeNode) {
    this.nodeNodes.set(`${node.nodeType}_${node.id}`, node);
  }

  public addNodes(nodes: SimpleGraphNodeNode[]) {
    nodes.forEach((node) => {
      this.addNode(node);
    });
  }

  public addEdge(node: SimpleGraphEdgeNode) {
    this.edgeNodes.set(`${node.nodeType}_${node.id}`, node);
  }

  public addEdges(nodes: SimpleGraphEdgeNode[]) {
    nodes.forEach((node) => {
      this.addEdge(node);
    });
  }

  public addLabel(node: SimpleGraphLabelNode) {
    this.labelNodes.set(`${node.nodeType}_${node.id}`, node);
  }

  public addLabels(nodes: SimpleGraphLabelNode[]) {
    nodes.forEach((node) => {
      this.addLabel(node);
    });
  }

  public addProperty(node: SimpleGraphPropertyNode) {
    this.propertyNodes.set(`${node.nodeType}_${node.id}`, node);
  }

  public addProperties(nodes: SimpleGraphPropertyNode[]) {
    nodes.forEach((node) => {
      this.addProperty(node);
    });
  }

  public emptyGraph() {
    this.nodeNodes = new Map();
    this.edgeNodes = new Map();
    this.labelNodes = new Map();
    this.propertyNodes = new Map();
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

  public induceWorkload(workload: Workload) {
    return induceWorkload(this, workload);
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
