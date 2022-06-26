import {
  DataSimpleGraph,
  InducedSimpleGraph,
} from "simpleGraphEntities/simpleGraph";
import {
  SimpleGraphLabelEdge,
  SimpleGraphPropertyEdge,
} from "simpleGraphEntities/simpleGraphEdge";
import {
  SimpleGraphEdgeNode,
  SimpleGraphLabelNode,
  SimpleGraphNodeNode,
  SimpleGraphPropertyNode,
} from "simpleGraphEntities/simpleGraphNode";
import { toSimpleId } from "types/id";
import { NodeType } from "types/simpleGraph/nodeType";
import { Workload } from "types/workload";

export enum InductionMethod {
  "project",
  "filter",
}

export function induceWorkload(
  graph: DataSimpleGraph,
  workload: Workload,
  inductionMethod: InductionMethod
): InducedSimpleGraph {
  const inducedGraph = InducedSimpleGraph.instance;
  inducedGraph.emptyGraph();

  // Get all Label nodes that occur in the workload and add them to the induced graph.
  const workloadNodes = graph.labelNodes.filter((node) => {
    workload.has(node.label);
  });

  // Get edges that end at the label nodes.
  const workloadEdges = graph.labelEdges.filter((edge) => {
    Array.from(workloadNodes).includes(edge.endNode);
  });

  workloadEdges.forEach((edge) => {
    if (edge.startNode.nodeType == NodeType.node) {
      if (!inducedGraph.nodeNodes.includes(edge.startNode)) {
        inducedGraph.addNodeNode(edge.startNode);
      }
    } else {
      if (!inducedGraph.edgeNodes.includes(edge.startNode)) {
        inducedGraph.addEdgeNode(edge.startNode);
      }
    }
  });

  //Get all Property edges connected to the Node or Edge nodes
  inducedGraph.addPropertyEdges(
    graph.propertyEdges.filter((edge) => {
      inducedGraph.nodeNodes.includes(edge.startNode) ||
        inducedGraph.edgeNodes.includes(edge.startNode);
    })
  );

  inducedGraph.addPropertyNodes(inducedGraph.propertyEdges.map((edge) => edge.endNode));

  //Get all Label edges connected to the Node or Edge nodes
  inducedGraph.addLabelEdges(
    graph.labelEdges.filter((edge) => {
      inducedGraph.nodeNodes.includes(edge.startNode) ||
        inducedGraph.edgeNodes.includes(edge.startNode);
    })
  );

  inducedGraph.addLabelNodes(inducedGraph.labelEdges.map((edge) => edge.endNode));

  if (inductionMethod === InductionMethod.project) {

  }
  else if (inductionMethod === InductionMethod.filter) {
     
  }

  return inducedGraph;
}
