import { Id, SimpleId } from "types/id";
import { NodeType } from "types/simpleGraph/nodeType";
import { Label } from "types/label";
import { PropertyType } from "types/property";

export abstract class SimpleGraphNode {
  readonly id!: SimpleId;
  readonly label!: Label;
  protected nodeType!: NodeType;
}

export class SimpleGraphNodeNode extends SimpleGraphNode {
  nodeType = NodeType.node;
  label = "node";

  constructor(id: Id) {
    super();
    Object.assign(this, { id: `${this.nodeType}_${id}` });
  }
}

export class SimpleGraphEdgeNode extends SimpleGraphNode {
  nodeType = NodeType.edge;
  label = "edge";

  constructor(id: Id) {
    super();
    Object.assign(this, { id: `${this.nodeType}_${id}` });
  }
}

export class SimpleGraphLabelNode extends SimpleGraphNode {
  nodeType = NodeType.label;

  constructor(label: Label) {
    super();
    Object.assign(this, { id: `${this.nodeType}_${label}`, label: label });
  }
}

export class SimpleGraphPropertyNode extends SimpleGraphNode {
  nodeType = NodeType.propertyType;

  constructor(propertyType: PropertyType) {
    super();
    Object.assign(this, {
      id: `${this.nodeType}_${propertyType}`,
      label: propertyType,
    });
  }
}
