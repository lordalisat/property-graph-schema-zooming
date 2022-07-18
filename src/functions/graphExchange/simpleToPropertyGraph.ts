import { PropertyGraph, propertyGraphService } from "propertyGraphEntities/propertyGraph";
import { PropertyGraphEdge } from "propertyGraphEntities/propertyGraphEdge";
import { PropertyGraphNode } from "propertyGraphEntities/propertyGraphNode";
import { SimpleGraph } from "simpleGraphEntities/simpleGraph";
import { fromSimpleId } from "types/id";
import { EdgeDirection } from "types/simpleGraph/edgeLabel";

export function simpleToPropertyGraph(graph: SimpleGraph): PropertyGraph {
  const propertyGraph = propertyGraphService[graph.type] as PropertyGraph;
  propertyGraph.emptyGraph();

  propertyGraph.nodes = new Map(graph.nodeNodes.map((node) => {
    const labels = graph.labelEdges.filter((edge) => edge.sourceNode === node).map((edge) => edge.targetNode.label);
    const properties = new Map(graph.propertyEdges.filter((edge) => edge.sourceNode === node).map((edge) => [edge.label.toString(), edge.sourceNode.label]));

    const id = fromSimpleId(node.id);
    const propertyNode = new PropertyGraphNode({ id: id, labels: labels, properties: properties });

    return [fromSimpleId(node.id), propertyNode]
  }));

  propertyGraph.edges = new Map(graph.edgeNodes.map((node) => {
    const labels = graph.labelEdges.filter((edge) => edge.sourceNode === node).map((edge) => edge.targetNode.label);
    const properties = new Map(graph.propertyEdges.filter((edge) => edge.sourceNode === node).map((edge) => [edge.label.toString(), edge.sourceNode.label]));
    const connectedEdges = graph.edgeEdges.filter((edge) => edge.sourceNode === node);

    if (connectedEdges.length != 2) {
      throw new Error("Edge must have 2 connected nodes");
    }

    if ((connectedEdges[0].label === EdgeDirection.connects && !(connectedEdges[1].label === EdgeDirection.connects))
      || (connectedEdges[0].label === EdgeDirection.to && !(connectedEdges[1].label === EdgeDirection.from))
      || connectedEdges[0].label === EdgeDirection.from && !(connectedEdges[1].label === EdgeDirection.to)) {
      throw new Error("Edges must have same directionality");
    }

    const isDirected = connectedEdges[0].label === EdgeDirection.connects;
    let sourceNode;
    let targetNode;
    if (!isDirected || connectedEdges[0].label === EdgeDirection.from) {
      sourceNode = fromSimpleId(connectedEdges[0].targetNode.id);
      targetNode = fromSimpleId(connectedEdges[1].targetNode.id);
    }
    else {
      sourceNode = fromSimpleId(connectedEdges[1].targetNode.id);
      targetNode = fromSimpleId(connectedEdges[0].targetNode.id);
    }

    const id = fromSimpleId(node.id);
    const propertyEdge = new PropertyGraphEdge({ id: id, labels: labels, properties: properties, sourceNode: sourceNode, targetNode: targetNode, isDirected: isDirected});

    return [fromSimpleId(node.id), propertyEdge]
  }));

  return propertyGraph;
}