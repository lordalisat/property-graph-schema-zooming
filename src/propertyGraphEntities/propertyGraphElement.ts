import { Id } from "types/id";
import { Label } from "types/label";
import { Property } from "types/property";
import { Value } from "types/propertyGraph/value";

export abstract class PropertyGraphElement {
    protected id!: Id;
    protected labels!: Array<Label>;
    protected properties!: Map<Property, Value>;

    public getId(): Id {
        return this.id;
    }

    public getLabels(): Array<Label> {
        return this.labels;
    }

    public getProperties(): Map<Property, Value> {
        return this.properties;
    }
}