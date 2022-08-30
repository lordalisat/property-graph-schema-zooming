<script lang="ts">
import { PropertyGraph } from "propertyGraphEntities/propertyGraph";

  import { getContext } from "svelte";
  import Editor from "./Editor.svelte";
  import {content, threshold, selectedGraph, graphList, propData } from "./stores";

  const { open } = getContext('simple-modal');
  const openEditor = () => open(Editor, {content}, {}, {
    onClosed: () => {
      try {
        const graph = PropertyGraph.fromJSON($content.text);
        propData.set(graph);
      } catch (error) {
        console.error(error.message);
      }
    }
  });
</script>

<label>
  Threshold: {$threshold}
  <input type=range bind:value={$threshold} min=0 max=1 step=.1>
</label>
<label>
  Selected graph type:
  <select bind:value={$selectedGraph} >
    {#each graphList as graph}
      <option value={graph}>
        {graph.name}
      </option>
    {/each}
  </select>
</label>
<button on:click={openEditor}>Edit Data</button>