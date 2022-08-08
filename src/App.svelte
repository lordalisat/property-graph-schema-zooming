<script lang='ts'>
	import SimpleGraph from './SimpleGraph.svelte';

	import {graph} from './data';
</script>

<main>
  <div class="chart">
    <SimpleGraph graph={graph}></SimpleGraph>
  </div>
</main>
