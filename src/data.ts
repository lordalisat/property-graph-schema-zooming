import PropertyGraphSvelte from "svelte/PropertyGraph.svelte";
import SimpleGraphSvelte from "svelte/SimpleGraph.svelte";
import type { Workload } from "types/workload";

export const data = `{
  "nodes": [
    {
      "id": "n1",
      "labels": [
        "Person"
      ],
      "properties": {
        "name": "Alic"
      }
    },
    {
      "id": "n2",
      "labels": [
        "Person"
      ],
      "properties": {
        "name": "Bob"
      }
    },
    {
      "id": "n3",
      "labels": [
        "Person"
      ],
      "properties": {
        "name": "Charlie"
      }
    },
    {
      "id": "n4",
      "labels": [
        "Person"
      ],
      "properties": {
        "name": "David"
      }
    },
    {
      "id": "n5",
      "labels": [
        "Club"
      ],
      "properties": {
        "name": "Graffiti Club"
      }
    },
    {
      "id": "n6",
      "labels": [
        "Club"
      ],
      "properties": {
        "name": "Horse Club"
      }
    },
    {
      "id": "n7",
      "labels": [
        "City"
      ],
      "properties": {
        "name": "Eindhoven"
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "n1",
      "target": "n2",
      "isDirected": true,
      "labels": [
        "follows"
      ],
      "properties": {}
    },
    {
      "id": "e2",
      "source": "n1",
      "target": "n3",
      "isDirected": true,
      "labels": [
        "follows"
      ],
      "properties": {}
    },
    {
      "id": "e3",
      "source": "n3",
      "target": "n1",
      "isDirected": true,
      "labels": [
        "follows"
      ],
      "properties": {}
    },
    {
      "id": "e4",
      "source": "n1",
      "target": "n2",
      "isDirected": true,
      "labels": [
        "follows"
      ],
      "properties": {}
    },
    {
      "id": "e5",
      "source": "n1",
      "target": "n4",
      "isDirected": true,
      "labels": [
        "follows"
      ],
      "properties": {}
    },
    {
      "id": "e6",
      "source": "n1",
      "target": "n5",
      "isDirected": true,
      "labels": [
        "memberOf"
      ],
      "properties": {}
    },
    {
      "id": "e7",
      "source": "n1",
      "target": "n6",
      "isDirected": true,
      "labels": [
        "memberOf"
      ],
      "properties": {}
    },
    {
      "id": "e8",
      "source": "n3",
      "target": "n6",
      "isDirected": true,
      "labels": [
        "memberOf"
      ],
      "properties": {}
    },
    {
      "id": "e9",
      "source": "n1",
      "target": "n7",
      "isDirected": true,
      "labels": [
        "livesIn"
      ],
      "properties": {}
    },
    {
      "id": "e10",
      "source": "n3",
      "target": "n7",
      "isDirected": true,
      "labels": [
        "livesIn"
      ],
      "properties": {}
    },
    {
      "id": "e11",
      "source": "n4",
      "target": "n7",
      "isDirected": true,
      "labels": [
        "livesIn"
      ],
      "properties": {}
    }
  ]
}`

// const graph = new PropertyGraph();

// graph.addNode(new PropertyGraphNode({ id: "n1", labels: ["Person"], properties: new Map([["name", "Alice"]]) }));
// graph.addNode(new PropertyGraphNode({ id: "n2", labels: ["Person"], properties: new Map([["name", "Bob"]]) }));
// graph.addNode(new PropertyGraphNode({ id: "n3", labels: ["Person"], properties: new Map([["name", "Charlie"]]) }));
// graph.addNode(new PropertyGraphNode({ id: "n4", labels: ["Person"], properties: new Map([["name", "David"]]) }));

// graph.addNode(new PropertyGraphNode({ id: "n5", labels: ["Club"], properties: new Map([["name", "Graffiti Club"]]) }));
// graph.addNode(new PropertyGraphNode({ id: "n6", labels: ["Club"], properties: new Map([["name", "Horse Club"]]) }));

// graph.addNode(new PropertyGraphNode({ id: "n7", labels: ["City"], properties: new Map([["name", "Eindhoven"]]) }));

// graph.addEdge(new PropertyGraphEdge({ id: "e1", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n2", isDirected: true }));
// graph.addEdge(new PropertyGraphEdge({ id: "e2", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n3", isDirected: true }));
// graph.addEdge(new PropertyGraphEdge({ id: "e3", labels: ["follows"], properties: new Map(), sourceNode: "n3", targetNode: "n1", isDirected: true }));
// graph.addEdge(new PropertyGraphEdge({ id: "e4", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n2", isDirected: true }));
// graph.addEdge(new PropertyGraphEdge({ id: "e5", labels: ["follows"], properties: new Map(), sourceNode: "n1", targetNode: "n4", isDirected: true }));

// graph.addEdge(new PropertyGraphEdge({ id: "e6", labels: ["memberOf"], properties: new Map(), sourceNode: "n1", targetNode: "n5", isDirected: true }));
// graph.addEdge(new PropertyGraphEdge({ id: "e7", labels: ["memberOf"], properties: new Map(), sourceNode: "n1", targetNode: "n6", isDirected: true }));
// graph.addEdge(new PropertyGraphEdge({ id: "e8", labels: ["memberOf"], properties: new Map(), sourceNode: "n3", targetNode: "n6", isDirected: true }));

// graph.addEdge(new PropertyGraphEdge({ id: "e9", labels: ["livesIn"], properties: new Map(), sourceNode: "n1", targetNode: "n7", isDirected: true }));
// graph.addEdge(new PropertyGraphEdge({ id: "e10", labels: ["livesIn"], properties: new Map(), sourceNode: "n3", targetNode: "n7", isDirected: true }));
// graph.addEdge(new PropertyGraphEdge({ id: "e11", labels: ["livesIn"], properties: new Map(), sourceNode: "n4", targetNode: "n7", isDirected: true }));

// console.log(JSON.stringify(graph.toJSON()));

// export const propData = writable(graph);

export const workloadData: Workload = [{ label: "Person", occurence: 1 }, { label: "Club", occurence: .5 }, { label: "follows", occurence: 1 }, { label: "Random", occurence: .8 }];