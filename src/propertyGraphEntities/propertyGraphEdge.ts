
import type { Id } from "types/id";
import type { Label } from "types/label";
import type { Property } from "types/property";
import type { Value } from "types/propertyGraph/value";
import { PropertyGraphElement } from "./propertyGraphElement";

export class PropertyGraphEdge extends PropertyGraphElement {
  readonly sourceNode!: Id;
  readonly targetNode!: Id;
  readonly isDirected: boolean = true;

  constructor(args: {
    id: Id;
    labels: Array<Label>;
    properties: Map<Property, Value>;
    sourceNode: Id;
    targetNode: Id;
    isDirected?: boolean;
  }) {
    super();
    Object.assign(this, args);
  }

  static fromJSON(element: { id: string, source: string, target: string, isDirected: boolean, labels: Array<string>, properties: {} }): PropertyGraphEdge {
    if (!element.id) throw new Error(`Edge is missing id`);
    if (!element.source) throw new Error("Edge is missing source");
    if (!element.target) throw new Error("Edge is missing target");
    return new PropertyGraphEdge({ id: element.id, sourceNode: element.source, targetNode: element.target, isDirected: element.isDirected ?? true, labels: element.labels, properties: new Map(Object.entries(element.properties)) });
  }

  public toJSON(): { id: string, source: string, target: string, isDirected: boolean, labels: Array<string>, properties: {} } {
    return {id: this.id, source: this.sourceNode, target: this.targetNode, isDirected: this.isDirected, labels: this.labels, properties: Object.fromEntries(this.properties)}
  }
}
