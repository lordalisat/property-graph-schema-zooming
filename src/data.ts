import { Simulation } from "functions/equivalence/simulation";
import { propertyToSimpleGraph } from "functions/graphExchange/propertyToSimpleGraph";
import { simpleToPropertyGraph } from "functions/graphExchange/simpleToPropertyGraph";
import { induceWorkload, InductionMethod } from "functions/workloadInduction";
import { propertyGraphService } from "propertyGraphEntities/propertyGraph";
import { PropertyGraphEdge } from "propertyGraphEntities/propertyGraphEdge";
import { PropertyGraphNode } from "propertyGraphEntities/propertyGraphNode";
import { derived, writable } from "svelte/store";
import type { Workload } from "types/workload";

export const data = propertyGraphService.data;

data.addNode(new PropertyGraphNode({ id: "n1", labels: ["Person"], properties: new Map([["name", "Alice"]]) }));
data.addNode(new PropertyGraphNode({ id: "n2", labels: ["Person"], properties: new Map([["name", "Bob"]]) }));
data.addNode(new PropertyGraphNode({ id: "n3", labels: ["Person"], properties: new Map([["name", "Charlie"]]) }));
data.addNode(new PropertyGraphNode({ id: "n4", labels: ["Person"], properties: new Map([["name", "David"]]) }));

data.addNode(new PropertyGraphNode({ id: "n5", labels: ["Club"], properties: new Map([["name", "Graffiti Club"]]) }));
data.addNode(new PropertyGraphNode({ id: "n6", labels: ["Club"], properties: new Map([["name", "Horse Club"]]) }));

data.addNode(new PropertyGraphNode({ id: "n7", labels: ["City"], properties: new Map([["name", "Eindhoven"]]) }));

data.addEdge(new PropertyGraphEdge({ id: "e1", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n2", isDirected: true }));
data.addEdge(new PropertyGraphEdge({ id: "e2", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n3", isDirected: true }));
data.addEdge(new PropertyGraphEdge({ id: "e3", labels: ["follows"], properties: new Map(), sourceNode: "n3", targetNode: "n1", isDirected: true }));
data.addEdge(new PropertyGraphEdge({ id: "e4", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n2", isDirected: true }));
data.addEdge(new PropertyGraphEdge({ id: "e5", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n4", isDirected: true }));

data.addEdge(new PropertyGraphEdge({ id: "e6", labels: ["memberOf"], properties: new Map(), sourceNode: "n1", targetNode: "n5", isDirected: true }));
data.addEdge(new PropertyGraphEdge({ id: "e7", labels: ["memberOf"], properties: new Map(), sourceNode: "n1", targetNode: "n6", isDirected: true }));
data.addEdge(new PropertyGraphEdge({ id: "e8", labels: ["memberOf"], properties: new Map(), sourceNode: "n3", targetNode: "n6", isDirected: true }));

data.addEdge(new PropertyGraphEdge({ id: "e9", labels: ["livesIn"], properties: new Map(), sourceNode: "n1", targetNode: "n7", isDirected: true }));
data.addEdge(new PropertyGraphEdge({ id: "e10", labels: ["livesIn"], properties: new Map(), sourceNode: "n3", targetNode: "n7", isDirected: true }));
data.addEdge(new PropertyGraphEdge({ id: "e11", labels: ["livesIn"], properties: new Map(), sourceNode: "n4", targetNode: "n7", isDirected: true }));

export const workload: Workload = [{ label: "Person", occurence: 1 }, { label: "Club", occurence: .5 }, {label: "follows", occurence: 1}, { label: "Random", occurence: .8 }];
