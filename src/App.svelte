<script lang='ts'>
	import SimpleGraph from './SimpleGraph.svelte';

	import {data, workload} from './data';
  import PropertyGraph from 'PropertyGraph.svelte';
  import SplitPane from 'SplitPane.svelte';
  import { propertyToSimpleGraph } from 'functions/graphExchange/propertyToSimpleGraph';
  import { induceWorkload, InductionMethod } from 'functions/workloadInduction';
  import { simpleToPropertyGraph } from 'functions/graphExchange/simpleToPropertyGraph';
  import { Simulation } from 'functions/equivalence/simulation';

  let inductionMethod = InductionMethod.project;
  let threshold = 0;

  let simpleData = propertyToSimpleGraph(data);

  let simpleInduced = induceWorkload(workload, inductionMethod, threshold);
  let propInduced = simpleToPropertyGraph(simpleInduced);

  let simpleSchema = new Simulation().calculateSchema(simpleInduced);
  let propSchema = simpleToPropertyGraph(simpleSchema);

  $: simpleData = propertyToSimpleGraph(data);

  $: simpleInduced = induceWorkload(workload, inductionMethod, threshold);
  $: propInduced = simpleToPropertyGraph(simpleInduced);

  $: simpleSchema = new Simulation().calculateSchema(simpleInduced);
  $: propSchema = simpleToPropertyGraph(simpleSchema);

  const graphList = [
    { name: 'SimpleData', component: SimpleGraph, graph: simpleData },
    { name: 'SimpleInduced', component: SimpleGraph, graph: simpleInduced },
    { name: 'SimpleSchema', component: SimpleGraph, graph: simpleSchema },
    { name: 'PropertyData', component: PropertyGraph, graph: data },
    { name: 'PropertyInduced', component: PropertyGraph, graph: propInduced },
    { name: 'PropertySchema', component: PropertyGraph, graph: propSchema },
  ];
	let selectedGraph = graphList[0];
</script>

<main>
  <SplitPane>
    <svelte:fragment slot="left">
      {#key selectedGraph.name}
        <svelte:component this={selectedGraph.component} graph={selectedGraph.graph} />
      {/key}
    </svelte:fragment>
    <svelte:fragment slot="right">
      <div class="menu">
        <label>
          <input type=number bind:value={threshold} min=0 max=1 step=.1>
          <input type=range bind:value={threshold} min=0 max=1 step=.1>
        </label>
        <select bind:value={selectedGraph} >
        {#each graphList as graph}
        <option value={graph}>
          {graph.name}
        </option>
        {/each}
      </div>
    </svelte:fragment>
  </SplitPane>
</main>