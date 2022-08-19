import { type PropertyGraph, propertyGraphService } from "propertyGraphEntities/propertyGraph";
import { PropertyGraphEdge } from "propertyGraphEntities/propertyGraphEdge";
import { PropertyGraphNode } from "propertyGraphEntities/propertyGraphNode";
import { simpleGraphService, type SimpleGraph } from "./simpleGraphEntities/simpleGraph";
import { SimpleGraphEdge } from "./simpleGraphEntities/simpleGraphEdge";
import { SimpleGraphNode } from "./simpleGraphEntities/simpleGraphNode";
import { EdgeDirection } from "./types/simpleGraph/edgeLabel";


export const propertyGraph: PropertyGraph = propertyGraphService.data;

propertyGraph.addNode(new PropertyGraphNode({ id: "n1", labels: ["Person"], properties: new Map([["name", "Alice"]]) }));
propertyGraph.addNode(new PropertyGraphNode({ id: "n2", labels: ["Person"], properties: new Map([["name", "Bob"]]) }));
propertyGraph.addNode(new PropertyGraphNode({ id: "n3", labels: ["Person"], properties: new Map([["name", "Charlie"]]) }));
propertyGraph.addNode(new PropertyGraphNode({ id: "n4", labels: ["Person"], properties: new Map([["name", "David"]]) }));

propertyGraph.addNode(new PropertyGraphNode({ id: "n5", labels: ["Club"], properties: new Map([["name", "Graffiti Club"]]) }));
propertyGraph.addNode(new PropertyGraphNode({ id: "n6", labels: ["Club"], properties: new Map([["name", "Horse Club"]]) }));

propertyGraph.addNode(new PropertyGraphNode({ id: "n7", labels: ["City"], properties: new Map([["name", "Eindhoven"]]) }));

propertyGraph.addEdge(new PropertyGraphEdge({ id: "e1", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n2", isDirected: true }));
propertyGraph.addEdge(new PropertyGraphEdge({ id: "e2", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n3", isDirected: true }));
propertyGraph.addEdge(new PropertyGraphEdge({ id: "e3", labels: ["follows"], properties: new Map(), sourceNode: "n3", targetNode: "n1", isDirected: true }));
propertyGraph.addEdge(new PropertyGraphEdge({ id: "e4", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n2", isDirected: true }));
propertyGraph.addEdge(new PropertyGraphEdge({ id: "e5", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n4", isDirected: true }));

propertyGraph.addEdge(new PropertyGraphEdge({ id: "e6", labels: ["memberOf"], properties: new Map(), sourceNode: "n1", targetNode: "n5", isDirected: true }));
propertyGraph.addEdge(new PropertyGraphEdge({ id: "e7", labels: ["memberOf"], properties: new Map(), sourceNode: "n1", targetNode: "n6", isDirected: true }));
propertyGraph.addEdge(new PropertyGraphEdge({ id: "e8", labels: ["memberOf"], properties: new Map(), sourceNode: "n3", targetNode: "n6", isDirected: true }));

propertyGraph.addEdge(new PropertyGraphEdge({ id: "e9", labels: ["livesIn"], properties: new Map(), sourceNode: "n1", targetNode: "n7", isDirected: true }));
propertyGraph.addEdge(new PropertyGraphEdge({ id: "e10", labels: ["livesIn"], properties: new Map(), sourceNode: "n3", targetNode: "n7", isDirected: true }));
propertyGraph.addEdge(new PropertyGraphEdge({ id: "e11", labels: ["livesIn"], properties: new Map(), sourceNode: "n4", targetNode: "n7", isDirected: true }));

export const simpleGraph: SimpleGraph = simpleGraphService.schema;

function getRandomInt(max) {
  max = Math.floor(max);
  return Math.floor(Math.random() * (max + 1));
}

simpleGraph.nodeNodes = [...Array(5).keys()].map(i => SimpleGraphNode.nodeNode(i.toString()));
simpleGraph.edgeNodes = [...Array(5).keys()].map(i => SimpleGraphNode.edgeNode(i.toString()));

for (let i = 0; i <= 4; i++) {
  const startNode = simpleGraph.nodeNodes[getRandomInt(4)];
  const endNode = simpleGraph.nodeNodes[getRandomInt(4)];
  const edge = simpleGraph.edgeNodes[i];
  simpleGraph.edgeEdges.push(SimpleGraphEdge.edgeEdge(edge, startNode, EdgeDirection.from));
  simpleGraph.edgeEdges.push(SimpleGraphEdge.edgeEdge(edge, endNode, EdgeDirection.to));
}