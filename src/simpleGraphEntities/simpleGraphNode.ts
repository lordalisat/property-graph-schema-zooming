import { Id, SimpleId, toSimpleId } from "types/id";
import { NodeType } from "types/simpleGraph/nodeType";
import { Label } from "types/label";
import { PropertyType } from "types/property";

export abstract class SimpleGraphNode {
  readonly id!: SimpleId;
  readonly label!: Label;
}

export class SimpleGraphNodeNode extends SimpleGraphNode {
  constructor(id: Id) {
    super();
    Object.assign(this, { id: toSimpleId(NodeType.node, id), label: "node" });
  }
}

export class SimpleGraphEdgeNode extends SimpleGraphNode {
  constructor(id: Id) {
    super();
    Object.assign(this, { id: toSimpleId(NodeType.edge, id), label: "edge" });
  }
}

export class SimpleGraphLabelNode extends SimpleGraphNode {
  constructor(label: Label) {
    super();
    Object.assign(this, { id: toSimpleId(NodeType.label, label), label: label });
  }
}

export class SimpleGraphPropertyNode extends SimpleGraphNode {
  constructor(propertyType: PropertyType) {
    super();
    Object.assign(this, {
      id: toSimpleId(NodeType.propertyType, propertyType.toString()),
      label: propertyType,
    });
  }
}
