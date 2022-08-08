import type { Id } from "types/id";
import type { Label } from "types/label";
import type { Property } from "types/property";
import type { Value } from "types/propertyGraph/value";

export abstract class PropertyGraphElement {
  readonly id!: Id;
  protected _labels!: Array<Label>;
  protected _properties!: Map<Property, Value>;

  public get labels(): Array<Label> {
    return this.labels;
  }

  public get properties(): Map<Property, Value> {
    return this.properties;
  }
}
