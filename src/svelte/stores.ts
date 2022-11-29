import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3";
import { data, workloadData } from "data";
import { Simulation } from "functions/equivalence/simulation";
import { propertyToSimpleGraph } from "functions/graphExchange/propertyToSimpleGraph";
import { simpleToPropertyGraph } from "functions/graphExchange/simpleToPropertyGraph";
import { induceWorkload, InductionMethod } from "functions/workloadInduction";
import { PropertyGraph } from "propertyGraphEntities/propertyGraph";
import { derived, writable } from "svelte/store";
import PropertyGraphSvelte from "./PropertyGraph.svelte";
import SimpleGraphSvelte from "./SimpleGraph.svelte";

export const graphContent = writable({ text: data });
export const inductionMethod = writable(InductionMethod.mask);
export const threshold = writable(0);
export const distance = writable(0);

export const workloadContent = writable({ text: workloadData });
export const workload = writable([]);
let unsubscribe;
export function setWorkload() {
  try {
    unsubscribe = workloadContent.subscribe((val) => {
      workload.set(JSON.parse(val.text));
    });
    unsubscribe();
  } catch (error) {
    console.error(error.message);
    unsubscribe();
  }
}
setWorkload();

export const propData = writable(new PropertyGraph());

export function setPropGraph() {
  try {
    unsubscribe = graphContent.subscribe((val) => {
      console.time('setPropertyDataGraph');
      propData.set(PropertyGraph.fromJSON(val.text));
      console.timeEnd('setPropertyDataGraph');
    });
    unsubscribe();
  } catch (error) {
    console.error(error.message);
    unsubscribe();
  }
}
setPropGraph();
export const simpleData = derived(propData, (propData) =>
  propertyToSimpleGraph(propData)
);

export const simpleInduced = derived(
  [simpleData, workload, inductionMethod, threshold, distance],
  ([simpleData, workload, inductionMethod, threshold, distance]) =>
    induceWorkload(simpleData, workload, inductionMethod, threshold, distance)
);
export const propInduced = derived(simpleInduced, (simpleInduced) =>
  simpleToPropertyGraph(simpleInduced)
);

export const simpleSchema = derived(simpleInduced, (simpleInduced) =>
  new Simulation().calculateSchema(simpleInduced)
);

export const propSchemaFull = writable(new PropertyGraph);

unsubscribe = simpleSchema.subscribe((simpleSchema) => {
  const schema = simpleToPropertyGraph(simpleSchema);
  const nodes = [...schema.nodes.values(), ...schema.edges.values()];
    nodes.forEach((node) => node.setPrintOptions());
    const edges = [...schema.edges.values()].flatMap((edge) => {
      return [
        {
          source: edge.isDirected ? schema.nodes.get(edge.sourceNode) : edge,
          target: edge.isDirected ? edge : schema.nodes.get(edge.sourceNode),
          directional: edge.isDirected,
        },
        {
          source: edge,
          target: schema.nodes.get(edge.targetNode),
          directional: edge.isDirected,
        },
      ];
    });
  forceSimulation()
    .nodes(nodes)
    .force("link", forceLink(edges).distance(250))
    .force("charge", forceManyBody().strength(-1200))
    .force("center", forceCenter(700, 500))
    .tick(600)
    .stop();
  nodes.forEach((node) => {
    node.fx = node.x;
    node.fy = node.y;
  });
  propSchemaFull.set(schema);
});
unsubscribe();

function nodeEquals(node, comp) {
  return JSON.stringify(node.labels) === JSON.stringify(comp.labels) &&
  node.properties.size === comp.properties.size &&
  Array.from(node.properties.keys()).every((key) => node.properties.get(key) == comp.properties.get(key))
}

export const propSchema = derived([simpleSchema, propSchemaFull], ([simpleSchema, propSchemaFull]) => {
  const graph = simpleToPropertyGraph(simpleSchema);
  graph.nodes.forEach((value, key) => {
    if (value.labels.length > 0 || value.properties.size > 0) {
      const node = [...propSchemaFull.nodes.values()].find((node) => (
        nodeEquals(value, node)
      ));
      if (node) {
        graph.nodes.set(key, node);
      }
    }
  });
  graph.edges.forEach((value, key) => {
    if (value.labels.length > 0 || value.properties.size > 0) {
      const node = [...propSchemaFull.edges.values()].find((node) => (
        JSON.stringify(node.labels) === JSON.stringify(value.labels) &&
        node.properties.size === value.properties.size &&
        Array.from(node.properties.keys()).every((key) => node.properties.get(key) == value.properties.get(key)) &&
        propSchemaFull.nodes.get(node.origSourceNode) === graph.nodes.get(value.sourceNode) &&
        propSchemaFull.nodes.get(node.origTargetNode) === graph.nodes.get(value.targetNode)
      ));
      if (node) {
        node.sourceNode = value.sourceNode;
        node.targetNode = value.targetNode;
        graph.edges.set(key, node);
      }
      // else {
      //   console.log(value);
      // }
    }
  });
  return graph;
});

export const graphList = [
  { name: "SimpleData", component: SimpleGraphSvelte, graph: simpleData },
  { name: "SimpleInduced", component: SimpleGraphSvelte, graph: simpleInduced },
  { name: "SimpleSchema", component: SimpleGraphSvelte, graph: simpleSchema },
  { name: "PropertyData", component: PropertyGraphSvelte, graph: propData },
  {
    name: "PropertyInduced",
    component: PropertyGraphSvelte,
    graph: propInduced,
  },
  { name: "PropertySchema", component: PropertyGraphSvelte, graph: propSchema },
];

export const selectedGraph = writable(graphList[5]);
