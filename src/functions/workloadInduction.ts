import {
  DataSimpleGraph,
  InducedSimpleGraph,
} from "simpleGraphEntities/simpleGraph";
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

  // Get edges that end at the label nodes.
  const workloadEdges = graph.labelEdges.filter((edge) => {
    workload.has(edge.targetNode.label);
  });

  workloadEdges.forEach((edge) => {
    if (edge.sourceNode.type == NodeType.node) {
      if (!inducedGraph.nodeNodes.includes(edge.sourceNode)) {
        inducedGraph.addNodeNode(edge.sourceNode);
      }
    } else {
      if (!inducedGraph.edgeNodes.includes(edge.sourceNode)) {
        inducedGraph.addEdgeNode(edge.sourceNode);
      }
    }
  });

  //Get all Property edges connected to the Node or Edge nodes
  inducedGraph.propertyEdges = graph.propertyEdges.filter((edge) => {
    inducedGraph.nodeNodes.includes(edge.sourceNode) ||
      inducedGraph.edgeNodes.includes(edge.sourceNode);
  });

  inducedGraph.propertyNodes = inducedGraph.propertyEdges.map(
    (edge) => edge.targetNode
  );

  //Get all Label edges connected to the Node or Edge nodes
  inducedGraph.labelEdges = graph.labelEdges.filter((edge) => {
    inducedGraph.nodeNodes.includes(edge.sourceNode) ||
      inducedGraph.edgeNodes.includes(edge.sourceNode);
  });

  inducedGraph.labelNodes = inducedGraph.labelEdges.map(
    (edge) => edge.targetNode
  );

  if (inductionMethod === InductionMethod.project) {
    //Add all Node and Edge nodes, as well as all connecting edges, so only properties and labels may be missing
    inducedGraph.nodeNodes = [...graph.nodeNodes];
    inducedGraph.edgeNodes = [...graph.edgeNodes];
    inducedGraph.edgeEdges = [...graph.edgeEdges];
  } else if (inductionMethod === InductionMethod.filter) {
    //Add all Edge edges where both start and end nodes are included in the graph
    //TODO check for existance of both edges per Edge node?
    inducedGraph.edgeEdges = graph.edgeEdges.filter((edge) => {
      inducedGraph.edgeNodes.includes(edge.sourceNode) &&
        inducedGraph.nodeNodes.includes(edge.targetNode);
    });
  }

  return inducedGraph;
}
