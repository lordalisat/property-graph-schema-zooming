import { induceWorkload } from "functions/workloadInduction";
import { SimpleId } from "types/id";
import { Workload } from "types/workload";
import { SimpleGraphEdge } from "./simpleGraphEdge";
import {
  SimpleGraphEdgeNode,
  SimpleGraphLabelNode,
  SimpleGraphNodeNode,
  SimpleGraphPropertyNode,
} from "./simpleGraphNode";

abstract class SimpleGraph {
  nodes: Map<SimpleId, SimpleGraphNodeNode>;
  edges: Map<SimpleId, SimpleGraphEdgeNode>;
  labels: Map<SimpleId, SimpleGraphLabelNode>;
  properties: Map<SimpleId, SimpleGraphPropertyNode>;

  incomingEdges: Map<SimpleId, Array<SimpleGraphEdge>>;
  outgoingEdges: Map<SimpleId, Array<SimpleGraphEdge>>;

  protected constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.labels = new Map();
    this.properties = new Map();
  }

  public addNode(node: SimpleGraphNodeNode) {
    this.nodes.set(`${node.nodeType}_${node.id}`, node);
  }

  public addNodes(nodes: SimpleGraphNodeNode[]) {
    for (const node of nodes) {
      this.addNode(node);
    }
  }

  public addEdge(node: SimpleGraphEdgeNode) {
    this.edges.set(`${node.nodeType}_${node.id}`, node);
  }

  public addEdges(nodes: SimpleGraphEdgeNode[]) {
    for (const node of nodes) {
      this.addEdge(node);
    }
  }

  public addLabel(node: SimpleGraphLabelNode) {
    this.labels.set(`${node.nodeType}_${node.id}`, node);
  }

  public addLabels(nodes: SimpleGraphLabelNode[]) {
    for (const node of nodes) {
      this.addLabel(node);
    }
  }

  public addProperty(node: SimpleGraphPropertyNode) {
    this.properties.set(`${node.nodeType}_${node.id}`, node);
  }

  public addProperties(nodes: SimpleGraphPropertyNode[]) {
    for (const node of nodes) {
      this.addProperty(node);
    }
  }

  public emptyGraph() {
    this.nodes = new Map();
    this.edges = new Map();
    this.labels = new Map();
    this.properties = new Map();
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
