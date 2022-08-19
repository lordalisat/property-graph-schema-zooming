<script lang='ts'>
	import SimpleGraph from './SimpleGraph.svelte';

	import {propertyGraph, simpleGraph} from './data';
import PropertyGraph from 'PropertyGraph.svelte';
</script>

<main>
  <div class="chart">
    <PropertyGraph graph={propertyGraph}></PropertyGraph>
  </div>
</main>
