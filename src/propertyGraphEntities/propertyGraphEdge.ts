import { PropertyGraphElement } from "./propertyGraphElement";
import { Label } from "types/label";
import { Property } from "types/property";
import { Id } from "types/id";
import { Value } from "types/propertyGraph/value";

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
