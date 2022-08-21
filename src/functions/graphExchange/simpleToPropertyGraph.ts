import { type PropertyGraph, propertyGraphService } from "propertyGraphEntities/propertyGraph";
import { PropertyGraphEdge } from "propertyGraphEntities/propertyGraphEdge";
import { PropertyGraphNode } from "propertyGraphEntities/propertyGraphNode";
import type { SimpleGraph } from "simpleGraphEntities/simpleGraph";
import { fromSimpleId } from "types/id";
import { EdgeDirection } from "types/simpleGraph/edgeLabel";

export function simpleToPropertyGraph(graph: SimpleGraph): PropertyGraph {
  const propertyGraph = propertyGraphService[graph.type] as PropertyGraph;
  propertyGraph.emptyGraph();

  propertyGraph.nodes = new Map([...graph.nodeNodes.values()].map((node) => {
    const labels = graph.labelEdges.filter((edge) => edge.source === node).map((edge) => edge.target.label);
    const properties = new Map(graph.propertyEdges.filter((edge) => edge.source === node).map((edge) => [edge.label.toString(), edge.source.label]));

    const id = fromSimpleId(node.id);
    const propertyNode = new PropertyGraphNode({ id: id, labels: labels, properties: properties });

    return [fromSimpleId(node.id), propertyNode]
  }));

  propertyGraph.edges = new Map([...graph.edgeNodes.values()].map((node) => {
    const labels = graph.labelEdges.filter((edge) => edge.source === node).map((edge) => edge.target.label);
    const properties = new Map(graph.propertyEdges.filter((edge) => edge.source === node).map((edge) => [edge.label.toString(), edge.source.label]));
    const connectedEdges = graph.edgeEdges.filter((edge) => edge.source === node);

    if (connectedEdges.length != 2) {
      throw new Error("Edge must have 2 connected nodes");
    }

    if ((connectedEdges[0].label === EdgeDirection.connects && !(connectedEdges[1].label === EdgeDirection.connects))
      || (connectedEdges[0].label === EdgeDirection.to && !(connectedEdges[1].label === EdgeDirection.from))
      || connectedEdges[0].label === EdgeDirection.from && !(connectedEdges[1].label === EdgeDirection.to)) {
      throw new Error("Edges must have same directionality");
    }

    const isDirected = connectedEdges[0].label === EdgeDirection.connects;
    let source;
    let target;
    if (!isDirected || connectedEdges[0].label === EdgeDirection.from) {
      source = fromSimpleId(connectedEdges[0].target.id);
      target = fromSimpleId(connectedEdges[1].target.id);
    }
    else {
      source = fromSimpleId(connectedEdges[1].target.id);
      target = fromSimpleId(connectedEdges[0].target.id);
    }

    const id = fromSimpleId(node.id);
    const propertyEdge = new PropertyGraphEdge({ id: id, labels: labels, properties: properties, sourceNode: source, targetNode: target, isDirected: isDirected});

    return [fromSimpleId(node.id), propertyEdge]
  }));

  return propertyGraph;
}