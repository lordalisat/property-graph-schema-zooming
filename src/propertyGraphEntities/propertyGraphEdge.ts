
import type { Id } from "types/id";
import type { Label } from "types/label";
import type { Property } from "types/property";
import type { Value } from "types/propertyGraph/value";
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
