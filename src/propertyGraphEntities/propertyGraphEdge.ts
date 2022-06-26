import { PropertyGraphElement } from "./propertyGraphElement";
import { Label } from "types/label";
import { Property } from "types/property";
import { Id } from "types/id";
import { Value } from "types/propertyGraph/value";

export class PropertyGraphEdge extends PropertyGraphElement {
  readonly startNode!: Id;
  readonly endNode!: Id;
  readonly isDirected: boolean = true;

  constructor(args: {
    id: Id;
    labels: Array<Label>;
    properties: Map<Property, Value>;
    startNode: Id;
    endNode: Id;
    isDirected?: boolean;
  }) {
    super();
    Object.assign(this, args);
  }
}
