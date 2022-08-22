<script lang='ts'>
	import SimpleGraph from './SimpleGraph.svelte';

	import {propData, propInduced, propSchema, simpleData, simpleInduced, simpleSchema} from './data';
import PropertyGraph from 'PropertyGraph.svelte';
</script>

<main>
  <!-- <div class="chart">
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
  </div> -->
  <div class="chart">
    <SimpleGraph graph={simpleSchema} />
  </div>
  <div class="chart">
    <PropertyGraph graph={propSchema} />
  </div>
</main>
