<script>
  import { JSONEditor, Mode, createAjvValidator } from "svelte-jsoneditor";
import { customValidator } from "./customValidator";

  import { content } from "./stores";

  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      nodes: {
        type: "array",
        items: {
          $ref: "node",
        },
      },
      edges: {
        type: "array",
        items: {
          $ref: "edge",
        },
      },
    },
    required: ["nodes"],
    title: "Graph",
  };

  const schemaDefinitions = {
    edge: {
      type: "object",
      additionalProperties: false,
      properties: {
        id: {
          type: "string",
        },
        source: {
          type: "string",
        },
        target: {
          type: "string",
        },
        isDirected: {
          type: "boolean",
        },
        labels: {
          type: "array",
          items: {
            $ref: "label",
          },
        },
        properties: {
          $ref: "properties",
        },
      },
      required: ["id", "isDirected", "source", "target"],
      title: "Edge",
    },
    node: {
      type: "object",
      additionalProperties: false,
      properties: {
        id: {
          type: "string",
        },
        labels: {
          type: "array",
          items: {
            $ref: "label",
          },
        },
        properties: {
          $ref: "properties",
        },
      },
      required: ["id"],
      title: "Node",
    },
    properties: {
      type: "object",
      additionalProperties: { type: ["string", "number", "boolean"] },
      title: "NodeProperties",
    },
    label: {
      type: "string",
      title: "Label",
    },
  };

  const validator = createAjvValidator(schema, schemaDefinitions);
</script>

<JSONEditor bind:content={$content} mode={Mode.text} mainMenuBar={false} validator={customValidator} />
