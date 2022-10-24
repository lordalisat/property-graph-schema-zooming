import type { Id } from "types/id";
import type { Label } from "types/label";
import type { Property } from "types/property";
import { elementType } from "types/propertyGraph/elementType";
import type { Value } from "types/propertyGraph/value";
import { PropertyGraphElement } from "./propertyGraphElement";

export class PropertyGraphEdge extends PropertyGraphElement {
  sourceNode!: Id;
  targetNode!: Id;
  readonly origSourceNode: Id;
  readonly origTargetNode: Id;
  readonly isDirected: boolean = true;
  readonly type = elementType.edge;

  constructor(args: {
    id: Id;
    labels: Array<Label>;
    properties: Map<Property, Value>;
    sourceNode: Id;
    targetNode: Id;
    isDirected?: boolean;
    x?: number;
    y?: number;
  }) {
    super();
    Object.assign(this, args);
    this.origSourceNode = this.sourceNode;
    this.origTargetNode = this.targetNode;
  }

  static fromJSON(element: {
    id: string;
    source: string;
    target: string;
    isDirected: boolean;
    labels: Array<string>;
    properties: Record<string, Value>;
  }): PropertyGraphEdge {
    if (!element.id) throw new Error(`Edge is missing id`);
    if (!element.source) throw new Error("Edge is missing source");
    if (!element.target) throw new Error("Edge is missing target");
    return new PropertyGraphEdge({
      id: element.id,
      sourceNode: element.source,
      targetNode: element.target,
      isDirected: element.isDirected ?? true,
      labels: element.labels,
      properties: new Map(Object.entries(element.properties)),
    });
  }

  public toJSON(): {
    id: string;
    source: string;
    target: string;
    isDirected: boolean;
    labels: Array<string>;
    properties: Record<string, Value>;
  } {
    return {
      id: this.id,
      source: this.sourceNode,
      target: this.targetNode,
      isDirected: this.isDirected,
      labels: this.labels,
      properties: Object.fromEntries(this.properties),
    };
  }
}
