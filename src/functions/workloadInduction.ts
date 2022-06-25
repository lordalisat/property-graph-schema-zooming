import { DataSimpleGraph, InducedSimpleGraph } from "simpleGraphEntities/simpleGraph";
import { Workload } from "types/workload";

export function induceWorkload(graph: DataSimpleGraph, workload: Workload): InducedSimpleGraph {
    const inducedGraph = InducedSimpleGraph.instance;
    inducedGraph.emptyGraph();

    const inducedLabels = graph.labels

    return inducedGraph;
}

