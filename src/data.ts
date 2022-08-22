import { Simulation } from "functions/equivalence/simulation";
import { propertyToSimpleGraph } from "functions/graphExchange/propertyToSimpleGraph";
import { simpleToPropertyGraph } from "functions/graphExchange/simpleToPropertyGraph";
import { induceWorkload, InductionMethod } from "functions/workloadInduction";
import { propertyGraphService } from "propertyGraphEntities/propertyGraph";
import { PropertyGraphEdge } from "propertyGraphEntities/propertyGraphEdge";
import { PropertyGraphNode } from "propertyGraphEntities/propertyGraphNode";
import type { Workload } from "types/workload";

export const propData = propertyGraphService.data;

propData.addNode(new PropertyGraphNode({ id: "n1", labels: ["Person"], properties: new Map([["name", "Alice"]]) }));
propData.addNode(new PropertyGraphNode({ id: "n2", labels: ["Person"], properties: new Map([["name", "Bob"]]) }));
propData.addNode(new PropertyGraphNode({ id: "n3", labels: ["Person"], properties: new Map([["name", "Charlie"]]) }));
propData.addNode(new PropertyGraphNode({ id: "n4", labels: ["Person"], properties: new Map([["name", "David"]]) }));

propData.addNode(new PropertyGraphNode({ id: "n5", labels: ["Club"], properties: new Map([["name", "Graffiti Club"]]) }));
propData.addNode(new PropertyGraphNode({ id: "n6", labels: ["Club"], properties: new Map([["name", "Horse Club"]]) }));

propData.addNode(new PropertyGraphNode({ id: "n7", labels: ["City"], properties: new Map([["name", "Eindhoven"]]) }));

propData.addEdge(new PropertyGraphEdge({ id: "e1", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n2", isDirected: true }));
propData.addEdge(new PropertyGraphEdge({ id: "e2", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n3", isDirected: true }));
propData.addEdge(new PropertyGraphEdge({ id: "e3", labels: ["follows"], properties: new Map(), sourceNode: "n3", targetNode: "n1", isDirected: true }));
propData.addEdge(new PropertyGraphEdge({ id: "e4", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n2", isDirected: true }));
propData.addEdge(new PropertyGraphEdge({ id: "e5", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n4", isDirected: true }));

propData.addEdge(new PropertyGraphEdge({ id: "e6", labels: ["memberOf"], properties: new Map(), sourceNode: "n1", targetNode: "n5", isDirected: true }));
propData.addEdge(new PropertyGraphEdge({ id: "e7", labels: ["memberOf"], properties: new Map(), sourceNode: "n1", targetNode: "n6", isDirected: true }));
propData.addEdge(new PropertyGraphEdge({ id: "e8", labels: ["memberOf"], properties: new Map(), sourceNode: "n3", targetNode: "n6", isDirected: true }));

propData.addEdge(new PropertyGraphEdge({ id: "e9", labels: ["livesIn"], properties: new Map(), sourceNode: "n1", targetNode: "n7", isDirected: true }));
propData.addEdge(new PropertyGraphEdge({ id: "e10", labels: ["livesIn"], properties: new Map(), sourceNode: "n3", targetNode: "n7", isDirected: true }));
propData.addEdge(new PropertyGraphEdge({ id: "e11", labels: ["livesIn"], properties: new Map(), sourceNode: "n4", targetNode: "n7", isDirected: true }));

export const simpleData = propertyToSimpleGraph(propData);

const workload: Workload = [{ label: "Person", occurence: 1 }, { label: "Club", occurence: .5 }, {label: "follows", occurence: 1}, { label: "Random", occurence: .8 }];

export let threshold = 0;
export let inductionMethod = InductionMethod.filter;

export const simpleInduced = induceWorkload(workload, inductionMethod, threshold);
export const propInduced = simpleToPropertyGraph(simpleInduced);

export const simpleSchema = new Simulation().calculateSchema(simpleInduced);
export const propSchema = simpleToPropertyGraph(simpleSchema);