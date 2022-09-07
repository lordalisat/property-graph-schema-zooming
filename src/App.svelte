<script lang='ts'>
  import Modal from 'svelte-simple-modal';
import SideMenu from 'svelte/SideMenu.svelte';
import SplitPane from 'svelte/SplitPane.svelte';
  import { selectedGraph } from 'svelte/stores';
  import TailwindCss from 'svelte/TailwindCSS.svelte';
</script>

<TailwindCss />

<main class="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">
  <SplitPane>
    <svelte:fragment slot="left">
      {#key $selectedGraph.name}
        <svelte:component this={$selectedGraph.component} graph={$selectedGraph.graph} />
      {/key}
    </svelte:fragment>
    <svelte:fragment slot="right" >
      <Modal closeOnEsc={false} closeOnOuterClick={false}>
        <SideMenu />
      </Modal>
    </svelte:fragment>
  </SplitPane>
</main>