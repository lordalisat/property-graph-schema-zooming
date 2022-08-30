<script lang="ts">
  import { PropertyGraph } from "propertyGraphEntities/propertyGraph";
  import { getContext } from "svelte";
  import Editor from "./Editor.svelte";
  import {content, threshold, selectedGraph, graphList, propData, inductionMethod } from "./stores";
  import { InductionMethod } from "functions/workloadInduction";

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

<div class="m-2">
  <h2 class="font-semibold text-2xl text-gray-900 dark:text-white">Options</h2>
  <menu class="space-y-1 max-w-md list-inside">
    <li>
      <h4 class="mb-1 font-semibold text-gray-900 dark:text-white">Threshold: {$threshold}</h4>
      <input type=range bind:value={$threshold} min=0 max=1 step=.1 class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
    </li>
    <li>
      <h4 class="mb-1 font-semibold text-gray-900 dark:text-white">Induction type:</h4>
      <div class="flex">
        {#each Object.values(InductionMethod) as method}
          <div class="flex items-center mr-4">
              <input bind:group={$inductionMethod} id="Filtered" type="radio" value={method} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label for="Filtered" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{method}</label>
          </div>
        {/each}
    </div>
    </li>
    <li>
      <h4 class="mb-1 font-semibold text-gray-900 dark:text-white">Selected graph type:</h4>
      <select bind:value={$selectedGraph} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
        {#each graphList as graph}
          <option value={graph}>
            {graph.name}
          </option>
        {/each}
      </select>
    </li>
    <li>
      <button class="py-2.5 px-5 mt-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" on:click={openEditor}>Edit Data</button>
    </li>
  </menu>
</div>