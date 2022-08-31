import { type ValidationError, ValidationSeverity } from "svelte-jsoneditor";

/**
 * rules:
 * - team, names, and ages must be filled in and be of correct type
 * - a team must have 4 members
 * - at lease one member of the team must be adult
 */
export function graphValidator(json): ValidationError[] {
  const errors: ValidationError[] = [];
  const nodes = [];
  const edges = [];

  function checkLabels(labels, index, path) {
    if (!Array.isArray(labels)) {
      errors.push({
        path: [path, index, "labels"],
        message: `must be array`,
        severity: ValidationSeverity.error,
      });
      return;
    }
    labels.forEach((label, i) => {
      if (typeof label !== "string") {
        errors.push({
          path: [path, index, "labels", i],
          message: `must be string`,
          severity: ValidationSeverity.error,
        });
      }
    });
  }

  function checkProperties(properties, index, path) {
    if (typeof properties !== "object") {
      errors.push({
        path: [path, index, "properties"],
        message: `must be object`,
        severity: ValidationSeverity.error,
      });
      return;
    }
    Object.entries(properties).forEach((prop) => {
      if (typeof prop[0] !== "string") {
        errors.push({
          path: [path, index, "properties", prop[0]],
          message: `key must be string`,
          severity: ValidationSeverity.error,
        });
      }
      if (
        !(
          prop[1].constructor === String ||
          prop[1].constructor === Number ||
          prop[1].constructor === Boolean ||
          prop[1].constructor === Array
        )
      ) {
        errors.push({
          path: [path, index, "properties", prop[0]],
          message: `must be string, number, boolean, array`,
          severity: ValidationSeverity.error,
        });
      }
    });
  }

  if ("nodes" in json) {
    if (!Array.isArray(json.nodes)) {
      errors.push({
        path: ["nodes"],
        message: "must be array",
        severity: ValidationSeverity.error,
      });
    } else {
      // check whether each node has id filled in correctly
      json.nodes.forEach((node, index) => {
        if (typeof node !== "object") {
          errors.push({
            path: ["nodes", index],
            message: `must be object`,
            severity: ValidationSeverity.error,
          });
          return;
        }
        if ("id" in node) {
          if (typeof node.id !== "string") {
            errors.push({
              path: ["nodes", index, "id"],
              message: `must be string`,
              severity: ValidationSeverity.error,
            });
          } else if (nodes.includes(node.id)) {
            errors.push({
              path: ["nodes", index, "id"],
              message: `id already exists`,
              severity: ValidationSeverity.error,
            });
          } else {
            nodes.push(node.id);
          }
        } else {
          errors.push({
            path: ["nodes", index],
            message: `must have required property 'id'`,
            severity: ValidationSeverity.error,
          });
        }

        if ("labels" in node) {
          checkLabels(node.labels, index, "nodes");
        }

        if ("properties" in node) {
          checkProperties(node.properties, index, "nodes");
        }
      });
    }
  } else {
    errors.push({
      path: [],
      message: `must have required property 'nodes'`,
      severity: ValidationSeverity.error,
    });
  }

  if ("edges" in json) {
    if (!Array.isArray(json.edges)) {
      errors.push({
        path: ["edges"],
        message: "must be array",
        severity: ValidationSeverity.error,
      });
    } else {
      // check whether each node has id filled in correctly
      json.edges.forEach((edge, index) => {
        if (typeof edge !== "object") {
          errors.push({
            path: ["edges", index],
            message: `must be object`,
            severity: ValidationSeverity.error,
          });
          return;
        }
        if ("id" in edge) {
          if (typeof edge.id !== "string") {
            errors.push({
              path: ["edges", index, "id"],
              message: `must be string`,
              severity: ValidationSeverity.error,
            });
          } else if (edges.includes(edge.id)) {
            errors.push({
              path: ["edges", index, "id"],
              message: `id already exists`,
              severity: ValidationSeverity.error,
            });
          } else {
            edges.push(edge.id);
          }
        } else {
          errors.push({
            path: ["edges", index],
            message: `must have required property 'id'`,
            severity: ValidationSeverity.error,
          });
        }
        if ("source" in edge) {
          if (typeof edge.source !== "string") {
            errors.push({
              path: ["edges", index, "source"],
              message: `must be string`,
              severity: ValidationSeverity.error,
            });
          } else if (!nodes.includes(edge.source)) {
            errors.push({
              path: ["edges", index, "source"],
              message: `must point to a valid node`,
              severity: ValidationSeverity.error,
            });
          }
        } else {
          errors.push({
            path: ["edges", index],
            message: `must have required property 'source'`,
            severity: ValidationSeverity.error,
          });
        }
        if ("target" in edge) {
          if (typeof edge.target !== "string") {
            errors.push({
              path: ["edges", index, "target"],
              message: `must be string`,
              severity: ValidationSeverity.error,
            });
          } else if (!nodes.includes(edge.target)) {
            errors.push({
              path: ["edges", index, "target"],
              message: `must point to a valid node`,
              severity: ValidationSeverity.error,
            });
          }
        } else {
          errors.push({
            path: ["edges", index],
            message: `must have required property 'target'`,
            severity: ValidationSeverity.error,
          });
        }

        if ("labels" in edge) {
          checkLabels(edge.labels, index, "edges");
        }

        if ("properties" in edge) {
          checkProperties(edge.properties, index, "edges");
        }
      });
    }
  } else {
    errors.push({
      path: [],
      message: `must have required property 'nodes'`,
      severity: ValidationSeverity.error,
    });
  }

  return errors;
}
