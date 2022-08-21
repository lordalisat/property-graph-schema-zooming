<script lang='ts'>
	import SimpleGraph from './SimpleGraph.svelte';

	import {propData, propInduced, simpleData, simpleInduced} from './data';
import PropertyGraph from 'PropertyGraph.svelte';
</script>

<main>
  <div class="chart">
    <SimpleGraph graph={simpleData} />
  </div>
  <div class="chart">
    <PropertyGraph graph={propData} />
  </div>
  <div class="chart">
    <SimpleGraph graph={simpleInduced} />
  </div>
  <div class="chart">
    <PropertyGraph graph={propInduced} />
  </div>
</main>
