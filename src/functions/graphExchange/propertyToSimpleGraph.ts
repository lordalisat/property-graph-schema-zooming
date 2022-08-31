import type { PropertyGraph } from "propertyGraphEntities/propertyGraph";
import { SimpleGraph } from "simpleGraphEntities/simpleGraph";
import { SimpleGraphEdge } from "simpleGraphEntities/simpleGraphEdge";
import { type SimpleGraphEdgeNode, type SimpleGraphLabelNode, SimpleGraphNode, type SimpleGraphNodeNode, type SimpleGraphPropertyNode } from "simpleGraphEntities/simpleGraphNode";
import type { Id } from "types/id";
import type { Label } from "types/label";
import { type Property, PropertyType } from "types/property";
import type { Value } from "types/propertyGraph/value";
import { EdgeDirection } from "types/simpleGraph/edgeLabel";

export function propertyToSimpleGraph(graph: PropertyGraph): SimpleGraph {
  const simpleGraph = new SimpleGraph();

  const nodeMap: Map<Id, SimpleGraphNodeNode> = new Map();
  const labelMap: Map<Label, SimpleGraphLabelNode> = new Map();
  const propertyMap: Map<PropertyType, SimpleGraphPropertyNode> = new Map();

  function getLabel(sourceNode: SimpleGraphNodeNode | SimpleGraphEdgeNode, label: Label) {
    let labelNode: SimpleGraphLabelNode;
    if (!labelMap.has(label)) {
      labelNode = SimpleGraphNode.labelNode(label);
      labelMap.set(label, labelNode)
      simpleGraph.addLabelNode(labelNode);
    }
    else {
      labelNode = labelMap.get(label);
    }
    simpleGraph.addLabelEdge(SimpleGraphEdge.labelEdge(sourceNode, labelNode))
  }

  function getProperty(sourceNode: SimpleGraphNodeNode | SimpleGraphEdgeNode, value: Value, key: Property) {
    let type;
    if (value.constructor === String) {
      type = PropertyType.string;
    }
    else if (value.constructor === Number) {
      type = PropertyType.number;
    }
    else if (value.constructor === Boolean) {
      type = PropertyType.boolean;
    }
    else if (value.constructor === Array) {
      type = PropertyType.array;
    }
    else {
      type = PropertyType.other;
    }
    let propertyNode;
    if (!propertyMap.has(type)) {
      propertyNode = SimpleGraphNode.propertyNode(type);
      propertyMap.set(type, propertyNode)
      simpleGraph.addPropertyNode(propertyNode);
    }
    else {
      propertyNode = propertyMap.get(type);
    }
    simpleGraph.addPropertyEdge(SimpleGraphEdge.propertyEdge(sourceNode, propertyNode, key));
  }

  graph.nodes.forEach((node) => {
    const nodeNode = SimpleGraphNode.nodeNode(node.id);
    nodeMap.set(node.id, nodeNode);
    simpleGraph.addNodeNode(nodeNode);

    node.labels.forEach((label) => getLabel(nodeNode, label));

    node.properties.forEach((value, key) => getProperty(nodeNode, value, key));
  })

  graph.edges.forEach((edge) => {
    const edgeNode = SimpleGraphNode.edgeNode(edge.id);
    simpleGraph.addEdgeNode(edgeNode);

    const sourceNode = nodeMap.get(edge.sourceNode);
    const targetNode = nodeMap.get(edge.targetNode);

    if (edge.isDirected) {
      simpleGraph.addEdgeEdge(SimpleGraphEdge.edgeEdge(edgeNode, sourceNode, EdgeDirection.from));
      simpleGraph.addEdgeEdge(SimpleGraphEdge.edgeEdge(edgeNode, targetNode, EdgeDirection.to));
    }
    else {
      simpleGraph.addEdgeEdge(SimpleGraphEdge.edgeEdge(edgeNode, sourceNode, EdgeDirection.connects1));
      simpleGraph.addEdgeEdge(SimpleGraphEdge.edgeEdge(edgeNode, targetNode, EdgeDirection.connects2));
    }

    edge.labels.forEach((label) => getLabel(edgeNode, label));

    edge.properties.forEach((value, key) => getProperty(edgeNode, value, key));
  })

  return simpleGraph;
}