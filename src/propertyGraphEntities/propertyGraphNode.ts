import { PropertyGraphElement } from "./propertyGraphElement";
import { Label } from "types/label";
import { Property } from "types/property";
import { Id } from "types/id";
import { Value } from "types/propertyGraph/value";

export class PropertyGraphNode extends PropertyGraphElement {

    constructor(args: {id: Id, labels: Array<Label>, properties: Map<Property, Value>}) {
        super();
        Object.assign(this, args);
    }
}