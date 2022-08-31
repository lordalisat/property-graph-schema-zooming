import type { Id } from "types/id";
import type { Label } from "types/label";
import type { Property } from "types/property";
import { elementType } from "types/propertyGraph/elementType";
import type { Value } from "types/propertyGraph/value";
import { PropertyGraphElement } from "./propertyGraphElement";

export class PropertyGraphNode extends PropertyGraphElement {
  readonly type = elementType.node;

  constructor(args: {
    id: Id;
    labels: Array<Label>;
    properties: Map<Property, Value>;
  }) {
    super();
    Object.assign(this, args);
  }

  static fromJSON(element: {
    id: string;
    labels: Array<string>;
    properties: Record<string, string | boolean | number>;
  }): PropertyGraphNode {
    if (!element.id) throw new Error(`Node is missing id`);
    return new PropertyGraphNode({
      id: element.id,
      labels: element.labels,
      properties: new Map(Object.entries(element.properties))
    });
  }

  public toJSON(): {
    id: string;
    labels: Array<string>;
    properties: Record<string, string | boolean | number>;
  } {
    return {
      id: this.id,
      labels: this.labels,
      properties: Object.fromEntries(this.properties)
    };
  }
}
