import { PropertyGraph } from "propertyGraphEntities/propertyGraph";
import { PropertyGraphEdge } from "propertyGraphEntities/propertyGraphEdge";
import { PropertyGraphNode } from "propertyGraphEntities/propertyGraphNode";
import type { SimpleGraph } from "simpleGraphEntities/simpleGraph";
import { fromSimpleId, type Id, type SimpleId } from "types/id";
import { EdgeDirection } from "types/simpleGraph/edgeLabel";

export function simpleToPropertyGraph(graph: SimpleGraph): PropertyGraph {
  console.time('simpleToPropertyGraph');
  const propertyGraph = new PropertyGraph();

  propertyGraph.nodes = new Map(
    [...graph.nodeNodes.values()].map((node) => {
      const labels = graph.labelEdges
        .filter((edge) => edge.source === node)
        .map((edge) => edge.target.label);
      const properties = new Map(
        graph.propertyEdges
          .filter((edge) => edge.source === node)
          .map((edge) => [edge.label.toString(), edge.target.label])
      );

      const id = fromSimpleId(node.id);
      const propertyNode = new PropertyGraphNode({
        id: id,
        labels: labels,
        properties: properties,
        x: node.x,
        y: node.y,
      });

      return [fromSimpleId(node.id), propertyNode];
    })
  );

  propertyGraph.edges = new Map(
    [...graph.edgeNodes.values()].flatMap((node) => {
      const labels = graph.labelEdges
        .filter((edge) => edge.source === node)
        .map((edge) => edge.target.label);
      const properties = new Map(
        graph.propertyEdges
          .filter((edge) => edge.source === node)
          .map((edge) => [edge.label.toString(), edge.target.label])
      );
      const connectedEdges = graph.edgeEdges.filter(
        (edge) => edge.source === node
      );

      if (connectedEdges[0].label === EdgeDirection.connects) {
        if (connectedEdges.some((edge) => edge.label !== EdgeDirection.connects)) {
          throw new Error("Edges must have same directionality");
        }
        if (connectedEdges.length < 2) {
          return [[fromSimpleId(node.id), createEdges(node.id, connectedEdges[0].target.id, connectedEdges[0].target.id, false, labels, properties)]];
        }
        return connectedEdges.flatMap((v, i) => connectedEdges.slice(i + 1).map((w, o) =>
          [fromSimpleId(node.id) + i + o, createEdges(node.id + i + o, v.target.id, w.target.id, false, labels, properties)]
        ))
      }

      const fromEdges = connectedEdges.filter((edge) => edge.label === EdgeDirection.from);
      const toEdges = connectedEdges.filter((edge) => edge.label === EdgeDirection.to);

      if (fromEdges.length === 0 || toEdges.length === 0) {
        throw new Error("Edge must have 2 connected nodes");
      }

      return fromEdges.flatMap((fromEdge, i) => toEdges.map((toEdge, o) =>
        [fromSimpleId(node.id) + i + o, createEdges(node.id + i + o, fromEdge.target.id, toEdge.target.id, true, labels, properties)]
      ))
    })
  );
  console.timeEnd('simpleToPropertyGraph');

  return propertyGraph;
}

function createEdges(id: Id, source: SimpleId, target: SimpleId, isDirected: boolean, labels: string[], properties: Map<string, string>) {
  const propertyEdge = new PropertyGraphEdge({
    id: id,
    labels: labels,
    properties: properties,
    sourceNode: fromSimpleId(source),
    targetNode: fromSimpleId(target),
    isDirected: isDirected,
  });
  return propertyEdge;
}

