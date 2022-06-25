import { Id } from "types/id";
import { Label } from "types/label";
import { Property } from "types/property";
import { Value } from "types/propertyGraph/value";

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
