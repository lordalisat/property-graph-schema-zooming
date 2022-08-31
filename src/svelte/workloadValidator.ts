import { createAjvValidator } from "svelte-jsoneditor";

const schema = {
  type: "array",
  items: {
    $ref: "workloadElement"
  },
};

const schemaDefinitions = {
  workloadElement: {
    type: "object",
    additionalProperties: false,
    properties: {
      label: {
        type: "string"
      },
      occurence: {
        type: "number",
        minimum: 0,
        maximum: 1,
      }
    },
    required: [
      "label",
      "occurence"
    ],
    title: "workloadElement"
  }
};

export const workloadValidator = createAjvValidator(schema, schemaDefinitions);