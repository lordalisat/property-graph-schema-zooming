import { SimpleGraph } from "simpleGraphEntities/simpleGraph";
import { NodeType } from "types/simpleGraph/nodeType";
import type { FilteredWorkload, Workload } from "types/workload";

export enum InductionMethod {
  "project" = "Project",
  "filter" = "Filter",
}

function filterWorkload(workload: Workload, threshold: number): FilteredWorkload {
  const filtered = workload.filter((val) => { return val.occurence >= threshold });
  return new Set(filtered.map((val) => val.label));
}

export function induceWorkload(
  graph: SimpleGraph,
  workload: Workload,
  inductionMethod: InductionMethod,
  threshold: number,
): SimpleGraph {
  const inducedGraph = new SimpleGraph();
  inducedGraph.emptyGraph();

  if (threshold === 0) {
    inducedGraph.nodeNodes = new Map([...graph.nodeNodes.values()].map((node) => ([node.id, { ...node }])));
    inducedGraph.edgeNodes = new Map([...graph.edgeNodes.values()].map((node) => ([node.id, { ...node }])));
    inducedGraph.labelNodes = new Map([...graph.labelNodes.values()].map((node) => ([node.id, { ...node }])));
    inducedGraph.propertyNodes = new Map([...graph.propertyNodes.values()].map((node) => ([node.id, { ...node }])));

    inducedGraph.edgeEdges = [...graph.edgeEdges.map((edge) => ({ ...edge, source: inducedGraph.edgeNodes.get(edge.source.id), target: inducedGraph.nodeNodes.get(edge.target.id) }))];
    inducedGraph.labelEdges = [...graph.labelEdges.map((edge) => ({ ...edge, source: inducedGraph.getNode(edge.source.id), target: inducedGraph.labelNodes.get(edge.target.id) }))];
    inducedGraph.propertyEdges = [...graph.propertyEdges.map((edge) => ({ ...edge, source: inducedGraph.getNode(edge.source.id), target: inducedGraph.propertyNodes.get(edge.target.id) }))];

    return inducedGraph;
  }

  const filteredWorkload = filterWorkload(workload, threshold);

  // Get edges that end at the label nodes.
  const workloadEdges = [...graph.labelEdges.filter((edge) => {
    return filteredWorkload.has(graph.labelNodes.get(edge.target.id).label);
  })];

  workloadEdges.forEach((edge) => {
    const source = graph.nodeNodes.get(edge.source.id) ?? graph.edgeNodes.get(edge.source.id);
    if (source.type == NodeType.node) {
      if (!inducedGraph.nodeNodes.has(edge.source.id)) {
        inducedGraph.addNodeNode({ ...source });
      }
    } else {
      if (!inducedGraph.edgeNodes.has(edge.source.id)) {
        inducedGraph.addEdgeNode({ ...source });
      }
    }
  });

  //Get all Property edges connected to the Node or Edge nodes
  inducedGraph.propertyEdges = graph.propertyEdges.filter((edge) => {
    return inducedGraph.nodeNodes.has(edge.source.id) ||
      inducedGraph.edgeNodes.has(edge.source.id);
  }).map((edge) => {
    if (!inducedGraph.propertyNodes.has(edge.target.id)) {
      inducedGraph.addPropertyNode({ ...edge.target })
    }
    return { ...edge, source: inducedGraph.getNode(edge.source.id), target: inducedGraph.propertyNodes.get(edge.target.id) }
  });

  //Get all Label edges connected to the Node or Edge nodes
  inducedGraph.labelEdges = graph.labelEdges.filter((edge) => {
    return inducedGraph.nodeNodes.has(edge.source.id) ||
      inducedGraph.edgeNodes.has(edge.source.id);
  }).map((edge) => {
    if (!inducedGraph.labelNodes.has(edge.target.id)) {
      inducedGraph.addLabelNode({ ...edge.target })
    }
    return { ...edge, source: inducedGraph.getNode(edge.source.id), target: inducedGraph.labelNodes.get(edge.target.id) }
  });

  if (inductionMethod === InductionMethod.project) {
    //Add all Node and Edge nodes, as well as all connecting edges, so only properties and labels may be missing
    [...graph.nodeNodes.values()].map((node) => {
      if (!inducedGraph.nodeNodes.has(node.id)) {
        inducedGraph.addNodeNode({ ...node })
      } [node.id, { ...node }]
    });
    [...graph.edgeNodes.values()].map((node) => {
      if (!inducedGraph.edgeNodes.has(node.id)) {
        inducedGraph.addEdgeNode({ ...node })
      } [node.id, { ...node }]
    });
    inducedGraph.edgeEdges = [...graph.edgeEdges.map((edge) => ({ ...edge, source: inducedGraph.edgeNodes.get(edge.source.id), target: inducedGraph.nodeNodes.get(edge.target.id) }))];
  } else if (inductionMethod === InductionMethod.filter) {
    //Add all Edge edges where both start and end nodes are included in the graph
    //TODO check for existance of both edges per Edge node?
    inducedGraph.edgeEdges = graph.edgeEdges.filter((edge) => {
      return inducedGraph.edgeNodes.has(edge.source.id) &&
        inducedGraph.nodeNodes.has(edge.target.id);
    }).map((edge) => ({ ...edge, source: inducedGraph.getNode(edge.source.id), target: inducedGraph.getNode(edge.target.id) }));
  }

  return inducedGraph;
}
