import { InducedSimpleGraph, SchemaSimpleGraph } from "simpleGraphEntities/simpleGraph";
import { SimpleGraphEdgeType } from "simpleGraphEntities/simpleGraphEdge";
import { SimpleGraphNodeType } from "simpleGraphEntities/simpleGraphNode";
import { SimpleId } from "types/id";
import { Label } from "types/label";
import { EdgeTId } from "types/simulation/edgeTId";
import { PId, PIdMaps } from "types/simulation/pIdMaps";
import { SignatureStorage } from "types/simulation/signatureStorage";
import { Equivalence } from "./equivalence";

export class Simulation extends Equivalence {
  private currentPId: PId;
  private storage: SignatureStorage;
  private k = 2;
  private nodes: SimpleGraphNodeType[];
  private edges: SimpleGraphEdgeType[];

  private insert(s: string): PId {
    if (this.storage.has(s)) {
      return this.storage.get(s);
    }
    this.currentPId++;
    this.storage.set(s, this.currentPId);
    return this.currentPId;
  }

  private uniqEdgeTId(edgeTIds: Array<EdgeTId>) {
    var seen = {};
    return edgeTIds.filter((edge) => {
      const key = JSON.stringify(edge);
      return seen.hasOwnProperty(key) ? false : (seen[key] = true);
    })
  }

  public calculateSchema(graph: InducedSimpleGraph): SchemaSimpleGraph {
    const schemaGraph = SchemaSimpleGraph.instance;
    schemaGraph.emptyGraph();
    this.currentPId = 0;
    this.storage = new Map();

    this.nodes = [...graph.nodeNodes, ...graph.edgeNodes, ...graph.labelNodes, ...graph.propertyNodes];
    this.edges = [...graph.edgeEdges, ...graph.labelEdges, ...graph.propertyEdges];

    const pIdMaps = this.build_bsim({new_pid: new Map(), old_pid: new Map(), j_pid: new Map()}, this.k)

    return schemaGraph;
  }
  
  private build_bsim(pIds: PIdMaps, k: number)
    : PIdMaps {
    if (k === 0) {
      this.nodes.sort((a, b) => a.label.localeCompare(b.label))
      var label: Label = this.nodes[0].label;
      this.nodes.forEach((node) => {
        if (node.label !== label) {
          this.currentPId++;
          label = node.label;
        }
        pIds.new_pid.set(node.id, this.currentPId);
        pIds.j_pid.set(node.id, [this.currentPId]);
      })
      return pIds
    }
    const algPIds = this.build_bsim(pIds, k - 1)

    pIds.old_pid = new Map(pIds.new_pid);

    const edgeTIds: Array<EdgeTId> = this.uniqEdgeTId(this.edges.map((edge) => {
      const oldPId = pIds.old_pid.get(edge.targetNode.id);
      return {
        sourceNode: edge.sourceNode,
        label: edge.label,
        targetNode: edge.targetNode,
        oldPId: oldPId,
      }
    }));

    this.nodes.forEach((node) => {
      let sig = pIds.j_pid.get(node.id)[0].toString();
      edgeTIds.filter((edge) => edge.sourceNode.id === node.id).forEach((edge) => {
        sig = `${sig}(${edge.label},${edge.oldPId})`;
      });
      const pId = this.insert(sig);
      pIds.new_pid.set(node.id, pId);
      pIds.j_pid.get(node.id).push(pId);
    })

    return algPIds;
  }
}