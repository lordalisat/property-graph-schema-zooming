import type { Id } from "src/types/id";
import type { Label } from "src/types/label";
import type { Property } from "src/types/property";
import type { Value } from "src/types/propertyGraph/value";
import { PropertyGraphElement } from "./propertyGraphElement";

export class PropertyGraphEdge extends PropertyGraphElement {
  readonly sourceNode!: Id;
  readonly targetNode!: Id;
  readonly isDirected: boolean = true;

  constructor(args: {
    id: Id;
    labels: Array<Label>;
    properties: Map<Property, Value>;
    sourceNode: Id;
    targetNode: Id;
    isDirected?: boolean;
  }) {
    super();
    Object.assign(this, args);
  }
}
