import { PropertyGraphElement } from "./propertyGraphElement";
import { Label } from "types/label";
import { Property } from "types/property";
import { Id } from "types/id";
import { Value } from "types/propertyGraph/value";

export class PropertyGraphEdge extends PropertyGraphElement {
    protected startNode!: Id;
    protected endNode!: Id;
    protected isDirected: Boolean = true;

    constructor(args: {id: Id, labels: Array<Label>, properties: Map<Property, Value>, startNode: Id, endNode: Id, isDirected?: Boolean}) {
        super();
        Object.assign(this, args);
    }

    public getStartNode(): Id {
        return this.startNode;
    }

    public getEndNode(): Id {
        return this.endNode;
    }

    public getIsDirected(): Boolean {
        return this.isDirected;
    }
}