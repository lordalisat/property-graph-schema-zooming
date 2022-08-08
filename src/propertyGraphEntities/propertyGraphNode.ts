
import type { Id } from "types/id";
import type { Label } from "types/label";
import type { Property } from "types/property";
import type { Value } from "types/propertyGraph/value";
import { PropertyGraphElement } from "./propertyGraphElement";

export class PropertyGraphNode extends PropertyGraphElement {
  constructor(args: {
    id: Id;
    labels: Array<Label>;
    properties: Map<Property, Value>;
  }) {
    super();
    Object.assign(this, args);
  }
}
