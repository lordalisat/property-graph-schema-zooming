<script lang="ts">
  import { getContext } from "svelte";
  import Editor from "./Editor.svelte";
  import {content, threshold, selectedGraph, graphList } from "./stores";

  const { open } = getContext('simple-modal');
  const openEditor = () => open(Editor, {content});
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