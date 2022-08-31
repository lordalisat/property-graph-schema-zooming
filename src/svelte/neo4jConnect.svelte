<script>
  import { connectDatabase, loadNeo4JGraph } from 'functions/loadNeo4JGraph';

  import { getContext } from 'svelte';
  import { graphContent } from './stores';

  const { close } = getContext('simple-modal');
	
	let url="", username="", password="", database="";
  let hasError = false;
  let submitted = false;
	
	function cancel() {
		close();
	}
	
	async function submit() {
    try {
		  const session = connectDatabase(url, database, username, password);
      graphContent.set({text: await loadNeo4JGraph(session)});
      close();
    } catch (error) {
      hasError = true;
      console.log(error);
    }
	}
</script>

<h2 class="font-semibold text-2xl">Connect to database:</h2>
{#if hasError == true}
  <div class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
    <span class="font-medium">Unable to connect to database.</span>
  </div>
{/if}
<form id="surveyForm" class="mt-4" class:submitted on:submit|preventDefault={submit}>
  <label class="block mb-2 text-sm font-medium">
    Server URL:
    <input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" bind:value={url} placeholder="Server URL" required>
  </label><br/>
  <label class="block mb-2 text-sm font-medium">
    Username:
    <input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" bind:value={username} placeholder="Username" required>
  </label><br/>
  <label class="block mb-2 text-sm font-medium">
    Password:
    <input type="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" bind:value={password} placeholder="Password" required>
  </label><br/>
  <label class="block mb-2 text-sm font-medium">
    Database:
    <input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" bind:value={database} placeholder="Database" required>
  </label>

  <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" on:click={() => submitted = true}>Submit</button>
  <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" on:click={cancel}>Cancel</button>
</form>