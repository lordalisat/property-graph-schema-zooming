<script lang="ts">
  import { JSONEditor, Mode, type Validator } from "svelte-jsoneditor";
  import type { Writable } from "svelte/store";

  export let content: Writable<{ text: string }>;
  export let validator: Validator;
</script>

<JSONEditor bind:content={$content} mode={Mode.text} mainMenuBar={false} validator={validator} />
