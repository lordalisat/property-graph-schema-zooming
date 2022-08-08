import type { Id } from "src/types/id";
import type { Label } from "src/types/label";
import type { Property } from "src/types/property";
import type { Value } from "src/types/propertyGraph/value";


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
