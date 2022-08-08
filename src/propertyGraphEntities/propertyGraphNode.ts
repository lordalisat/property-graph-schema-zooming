import type { Id } from "src/types/id";
import type { Label } from "src/types/label";
import type { Property } from "src/types/property";
import type { Value } from "src/types/propertyGraph/value";
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
