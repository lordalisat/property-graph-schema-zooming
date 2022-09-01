<script lang="ts">
  import { PropertyGraph } from "propertyGraphEntities/propertyGraph";
  import { getContext } from "svelte";
  import Editor from "./Editor.svelte";
  import {
    graphContent,
    workloadContent,
    workload,
    threshold,
    selectedGraph,
    graphList,
    propData,
    inductionMethod,
    propSchema,
setPropGraph,
  } from "./stores";
  import { InductionMethod } from "functions/workloadInduction";
  import { graphValidator } from "./graphValidator";
  import { workloadValidator } from "./workloadValidator";
import { download } from "./exportJson";
import Neo4jConnect from "./neo4jConnect.svelte";

  const { open } = getContext("simple-modal") as any;

  const openGraphEditor = () => {
    open(
      Editor,
      { content: graphContent, validator: graphValidator },
      {},
      {
        onClosed: () => {
          setPropGraph();
        },
      }
    );
  }
  const openWorkloadEditor = () => {
    open(
      Editor,
      { content: workloadContent, validator: workloadValidator },
      {},
      {
        onClosed: () => {
          try {
            const newWorkload = JSON.parse($workloadContent.text);
            if (!Array.isArray(newWorkload)) {
              throw new Error("Workload should be array");
            }
            newWorkload.forEach((val) => {
              if (!("label" in val) || typeof val.label !== "string") {
                throw new Error("Workload should have valid labels");
              }
              if (!("occurence" in val) || typeof val.occurence !== "number" || val.occurence < 0 || val.occurence > 1 ) {
                throw new Error("Workload should have valid occurences");
              }
            });
            workload.set(newWorkload);
          } catch (error) {
            console.error(error.message);
          }
        },
      }
    );
  }
  const openNeo4JConnect = () => {
    open(
      Neo4jConnect
    );
  }
</script>

<div class="m-2">
  <h2 class="font-semibold text-2xl text-gray-900 dark:text-white">Options</h2>
  <menu class="space-y-1 max-w-md list-inside">
    <li>
      <h4 class="mb-1 font-semibold text-gray-900 dark:text-white">
        Threshold: {$threshold}
      </h4>
      <input
        type="range"
        bind:value={$threshold}
        min="0"
        max="1"
        step=".1"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </li>
    <li>
      <h4 class="mb-1 font-semibold text-gray-900 dark:text-white">
        Induction type:
      </h4>
      <div class="flex">
        {#each Object.values(InductionMethod) as method}
          <div class="flex items-center mr-4">
            <input
              bind:group={$inductionMethod}
              id="Filtered"
              type="radio"
              value={method}
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              for="Filtered"
              class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >{method}</label
            >
          </div>
        {/each}
      </div>
    </li>
    <li>
      <h4 class="mb-1 font-semibold text-gray-900 dark:text-white">
        Selected graph type:
      </h4>
      <select
        bind:value={$selectedGraph}
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {#each graphList as graph}
          <option value={graph}>
            {graph.name}
          </option>
        {/each}
      </select>
    </li>
    <li>
      <h4 class="mb-1 font-semibold text-gray-900 dark:text-white">
        Edit data:
      </h4>
      <button
        class="py-2.5 px-5 mt-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        on:click={openGraphEditor}>
        Edit Graph
      </button>
      <button
        class="py-2.5 px-5 mt-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        on:click={openWorkloadEditor}>
        Edit Workload
      </button>
    </li>
    <li>
      <h4 class="mb-1 font-semibold text-gray-900 dark:text-white">
        Export schema:
      </h4>
      <button
        class="py-2.5 px-5 mt-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        on:click={() => download($propSchema.toJSON())}>
        Export schema
      </button>
    </li>
    <li>
      <h4 class="mb-1 font-semibold text-gray-900 dark:text-white">
        Import from Neo4J:
      </h4>
      <button
        class="py-2.5 px-5 mt-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        on:click={openNeo4JConnect}>
        Import from Neo4J
      </button>
    </li>
  </menu>
</div>
