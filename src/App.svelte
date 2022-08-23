<script lang='ts'>
  import Modal from 'svelte-simple-modal';
import SideMenu from 'svelte/SideMenu.svelte';
import SplitPane from 'svelte/SplitPane.svelte';
  import { selectedGraph } from 'svelte/stores';
</script>

<main>
  <SplitPane>
    <svelte:fragment slot="left">
      {#key $selectedGraph.name}
        <svelte:component this={$selectedGraph.component} graph={$selectedGraph.graph} />
      {/key}
    </svelte:fragment>
    <svelte:fragment slot="right">
      <div class="menu">
        <Modal>
          <SideMenu />
        </Modal>
      </div>
    </svelte:fragment>
  </SplitPane>
</main>