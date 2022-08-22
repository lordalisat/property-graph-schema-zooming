<script lang='ts'>
	import SimpleGraph from './SimpleGraph.svelte';

	import {propData, workload} from './data';
  import PropertyGraph from 'PropertyGraph.svelte';
  import SplitPane from 'SplitPane.svelte';
  import { propertyToSimpleGraph } from 'functions/graphExchange/propertyToSimpleGraph';
  import { induceWorkload, InductionMethod } from 'functions/workloadInduction';
  import { simpleToPropertyGraph } from 'functions/graphExchange/simpleToPropertyGraph';
  import { Simulation } from 'functions/equivalence/simulation';
  import { writable } from 'svelte/store';

  let inductionMethod = InductionMethod.project;
  let threshold = 0;

  let simpleData = writable(propertyToSimpleGraph($propData));

  let simpleInduced = writable(induceWorkload(workload, inductionMethod, threshold));
  let propInduced = writable(simpleToPropertyGraph($simpleInduced));

  let simpleSchema = writable(new Simulation().calculateSchema($simpleInduced));
  let propSchema = writable(simpleToPropertyGraph($simpleSchema));

  $: simpleData.set(propertyToSimpleGraph($propData));

  $: simpleInduced.set(induceWorkload(workload, inductionMethod, threshold));
  $: propInduced.set(simpleToPropertyGraph($simpleInduced));

  $: simpleSchema.set(new Simulation().calculateSchema($simpleInduced));
  $: propSchema.set(simpleToPropertyGraph($simpleSchema));

  const graphList = [
    { name: 'SimpleData', component: SimpleGraph, graph: simpleData },
    { name: 'SimpleInduced', component: SimpleGraph, graph: simpleInduced },
    { name: 'SimpleSchema', component: SimpleGraph, graph: simpleSchema },
    { name: 'PropertyData', component: PropertyGraph, graph: propData },
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