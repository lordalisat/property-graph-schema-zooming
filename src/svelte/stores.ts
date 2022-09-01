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
export const inductionMethod = writable(InductionMethod.project);
export const threshold = writable(0);

export const workloadContent = writable({ text: workloadData });
export const workload = writable([]);
let unsubscribe = workloadContent.subscribe((val) => {
  workload.set(JSON.parse(val.text));
});
unsubscribe();

export const propData = writable(new PropertyGraph());

export function setPropGraph() {
  try {
    unsubscribe = graphContent.subscribe((val) => {
      propData.set(PropertyGraph.fromJSON(val.text));
    });
    unsubscribe();
  } catch (error) {
    console.error(error.message);
  }
}
setPropGraph();
export const simpleData = derived(propData, (propData) =>
  propertyToSimpleGraph(propData)
);

export const simpleInduced = derived(
  [simpleData, workload, inductionMethod, threshold],
  ([simpleData, workload, inductionMethod, threshold]) =>
    induceWorkload(simpleData, workload, inductionMethod, threshold)
);
export const propInduced = derived(simpleInduced, (simpleInduced) =>
  simpleToPropertyGraph(simpleInduced)
);

export const simpleSchema = derived(simpleInduced, (simpleInduced) =>
  new Simulation().calculateSchema(simpleInduced)
);
export const propSchema = derived(simpleSchema, (simpleSchema) =>
  simpleToPropertyGraph(simpleSchema)
);

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
