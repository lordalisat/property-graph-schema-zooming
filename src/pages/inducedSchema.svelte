<script lang='ts'>
  import Modal from 'svelte-simple-modal';
  import PropertyGraph from 'svelte/PropertyGraph.svelte';
  import SideMenu from 'svelte/SideMenu.svelte';
  import SplitPane from 'svelte/SplitPane.svelte';
  import { propSchema } from 'svelte/stores';
  import TailwindCss from 'svelte/TailwindCSS.svelte';
</script>

<TailwindCss />

<main class="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">
  <SplitPane>
    <svelte:fragment slot="left">
      <PropertyGraph graph={propSchema} />
    </svelte:fragment>
    <svelte:fragment slot="right" >
      <Modal closeOnEsc={false} closeOnOuterClick={false}>
        <SideMenu allowInduction={true} testMode={true} />
      </Modal>
    </svelte:fragment>
  </SplitPane>
</main>