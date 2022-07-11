import { InducedSimpleGraph, SchemaSimpleGraph } from "simpleGraphEntities/simpleGraph";
import { SimpleGraphEdge } from "simpleGraphEntities/simpleGraphEdge";
import { SimpleGraphNode } from "simpleGraphEntities/simpleGraphNode";
import { SimpleId } from "types/id";
import { Label } from "types/label";
import { PId, PIdMaps } from "types/simulation/pIdMaps";
import { Equivalence } from "./equivalence";

export class Simulation extends Equivalence {
  private currentPId: PId;

  public calculateSchema(graph: InducedSimpleGraph): SchemaSimpleGraph {
    const schemaGraph = SchemaSimpleGraph.instance;
    schemaGraph.emptyGraph();
    this.currentPId = 0;



    return schemaGraph;
  }
  
  private build_bsim(nodes: SimpleGraphNode[], edges: SimpleGraphEdge[], pIds: PIdMaps, k: number)
    : { nodes: SimpleGraphNode[], edges: SimpleGraphEdge[], pIds: PIdMaps } {
    if (k === 0) {
      nodes.sort((a, b) => a.label.localeCompare(b.label))
      var label: Label = nodes[0].label;
      nodes.forEach((node) => {
        if (node.label !== label) {
          this.currentPId++;
          label = node.label;
        }
        pIds.new_pid.set(node.id, this.currentPId);
        pIds.j_pid.set(node.id, [this.currentPId]);
      })
      return { nodes, edges, pIds }
    }
    const bsim_vars = this.build_bsim(nodes, edges, pIds, k - 1)
    const algNodes = bsim_vars.nodes;
    const algEdges = bsim_vars.edges;
    const algPIds = bsim_vars.pIds;

    if (k === 1) {
      
    }
    pIds.old_pid = new Map(pIds.new_pid);
    return { nodes, edges, pIds }
  }
}