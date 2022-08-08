import { SimpleGraph, simpleGraphService } from "simpleGraphEntities/simpleGraph";
import { NodeType } from "types/simpleGraph/nodeType";
import type { Workload } from "types/workload";

export enum InductionMethod {
  "project",
  "filter",
}

export function induceWorkload(
  workload: Workload,
  inductionMethod: InductionMethod
): SimpleGraph {
  const graph = simpleGraphService.data;
  const inducedGraph = simpleGraphService.induced;
  inducedGraph.emptyGraph();

  // Get edges that end at the label nodes.
  const workloadEdges = graph.labelEdges.filter((edge) => {
    workload.has(edge.target.label);
  });

  workloadEdges.forEach((edge) => {
    if (edge.source.type == NodeType.node) {
      if (!inducedGraph.nodeNodes.includes(edge.source)) {
        inducedGraph.addNodeNode(edge.source);
      }
    } else {
      if (!inducedGraph.edgeNodes.includes(edge.source)) {
        inducedGraph.addEdgeNode(edge.source);
      }
    }
  });

  //Get all Property edges connected to the Node or Edge nodes
  inducedGraph.propertyEdges = graph.propertyEdges.filter((edge) => {
    inducedGraph.nodeNodes.includes(edge.source) ||
      inducedGraph.edgeNodes.includes(edge.source);
  });

  inducedGraph.propertyNodes = inducedGraph.propertyEdges.map(
    (edge) => edge.target
  );

  //Get all Label edges connected to the Node or Edge nodes
  inducedGraph.labelEdges = graph.labelEdges.filter((edge) => {
    inducedGraph.nodeNodes.includes(edge.source) ||
      inducedGraph.edgeNodes.includes(edge.source);
  });

  inducedGraph.labelNodes = inducedGraph.labelEdges.map(
    (edge) => edge.target
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
      inducedGraph.edgeNodes.includes(edge.source) &&
        inducedGraph.nodeNodes.includes(edge.target);
    });
  }

  return inducedGraph;
}
