import type { PropertyGraph } from "propertyGraphEntities/propertyGraph";
import { type SimpleGraph, simpleGraphService } from "simpleGraphEntities/simpleGraph";
import { SimpleGraphEdge } from "simpleGraphEntities/simpleGraphEdge";
import { type SimpleGraphEdgeNode, type SimpleGraphLabelNode, SimpleGraphNode, type SimpleGraphNodeNode, type SimpleGraphPropertyNode } from "simpleGraphEntities/simpleGraphNode";
import type { Id } from "types/id";
import type { Label } from "types/label";
import { type Property, PropertyType } from "types/property";
import type { Value } from "types/propertyGraph/value";
import { EdgeDirection } from "types/simpleGraph/edgeLabel";

export function propertyToSimpleGraph(graph: PropertyGraph): SimpleGraph {
  console.log(graph.type.toString());
  const simpleGraph = simpleGraphService[graph.type.valueOf()] as SimpleGraph;
  console.log(simpleGraph);
  simpleGraph.emptyGraph();

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
    switch (typeof value) {
      case "string": {
        type = PropertyType.string;
        break;
      }
      case "number": {
        type = PropertyType.number;
        break;
      }
      case "boolean": {
        type = PropertyType.boolean;
        break;
      }
      default: {
        type = PropertyType.other;
        break;
      }
    };
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
      simpleGraph.addEdgeEdge(SimpleGraphEdge.edgeEdge(edgeNode, sourceNode, EdgeDirection.connects));
      simpleGraph.addEdgeEdge(SimpleGraphEdge.edgeEdge(edgeNode, targetNode, EdgeDirection.connects));
    }

    edge.labels.forEach((label) => getLabel(edgeNode, label));

    edge.properties.forEach((value, key) => getProperty(edgeNode, value, key));
  })

  return simpleGraph;
}