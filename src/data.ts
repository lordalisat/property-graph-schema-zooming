import { simpleGraphService, type SimpleGraph } from "./simpleGraphEntities/simpleGraph";
import { SimpleGraphEdge } from "./simpleGraphEntities/simpleGraphEdge";
import { SimpleGraphNode } from "./simpleGraphEntities/simpleGraphNode";
import { EdgeDirection } from "./types/simpleGraph/edgeLabel";

export const graph: SimpleGraph = simpleGraphService.schema;

function getRandomInt(max) {
  max = Math.floor(max);
  return Math.floor(Math.random() * (max + 1));
}

graph.nodeNodes = [...Array(5).keys()].map(i => SimpleGraphNode.nodeNode(i.toString()));
graph.edgeNodes = [...Array(5).keys()].map(i => SimpleGraphNode.edgeNode(i.toString()));

for (let i = 0; i <= 4; i++) {
  const startNode = graph.nodeNodes[getRandomInt(4)];
  const endNode = graph.nodeNodes[getRandomInt(4)];
  const edge = graph.edgeNodes[i];
  graph.edgeEdges.push(SimpleGraphEdge.edgeEdge(edge, startNode, EdgeDirection.connects));
  graph.edgeEdges.push(SimpleGraphEdge.edgeEdge(edge, endNode, EdgeDirection.connects));
}