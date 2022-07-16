import { InducedSimpleGraph, SchemaSimpleGraph } from "simpleGraphEntities/simpleGraph";
import { SimpleGraphEdgeType } from "simpleGraphEntities/simpleGraphEdge";
import { SimpleGraphNodeType } from "simpleGraphEntities/simpleGraphNode";
import { toSimpleId } from "types/id";
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
  private pIds: PIdMaps;

  private insert(s: string): PId {
    if (this.storage.has(s)) {
      return this.storage.get(s);
    }
    this.currentPId++;
    this.storage.set(s, this.currentPId);
    return this.currentPId;
  }

  private uniqEdgeTId(edgeTIds: Array<EdgeTId>) {
    const seen = {};
    return edgeTIds.filter((edge) => {
      const key = JSON.stringify(edge);
      return seen.hasOwnProperty(key) ? false : (seen[key] = true);
    })
  }
  
  private groupBy(arr, property) {
    return arr.reduce(function(split, item) {
      if (!split[item[property]]) { split[item[property]] = []; }
      split[item[property]].push(item);
      return split;
    }, {});
  }

  private uniqEdges(edges: Array<SimpleGraphEdgeType>) {
    const seen = {};
    return edges.filter((edge) => {
      const key = JSON.stringify(edge);
      return seen.hasOwnProperty(key) ? false : (seen[key] = true);
    })
  }

  public calculateSchema(graph: InducedSimpleGraph): SchemaSimpleGraph {
    this.currentPId = 0;
    this.storage = new Map();

    this.nodes = [...graph.nodeNodes, ...graph.edgeNodes, ...graph.labelNodes, ...graph.propertyNodes];
    this.edges = [...graph.edgeEdges, ...graph.labelEdges, ...graph.propertyEdges];

    this.build_bsim(this.k);

    const schemaGraph = this.graphFromPIds();
    return schemaGraph;
  }
  
  private build_bsim(k: number)
    : void {
    if (k === 0) {
      this.nodes.sort((a, b) => a.label.localeCompare(b.label))
      let label: Label = this.nodes[0].label;
      this.nodes.forEach((node) => {
        if (node.label !== label) {
          this.currentPId++;
          label = node.label;
        }
        this.pIds.new_pid.set(node.id, this.currentPId);
        this.pIds.j_pid.set(node.id, [this.currentPId]);
      })
      return;
    }
    this.pIds.old_pid = new Map(this.pIds.new_pid);

    const edgeTIds: Array<EdgeTId> = this.uniqEdgeTId(this.edges.map((edge) => {
      const oldPId = this.pIds.old_pid.get(edge.targetNode.id);
      return {
        sourceNode: edge.sourceNode,
        label: edge.label,
        oldPId: oldPId,
      }
    }));

    this.nodes.forEach((node) => {
      let sig = this.pIds.j_pid.get(node.id)[0].toString();
      edgeTIds.filter((edge) => edge.sourceNode.id === node.id).forEach((edge) => {
        sig = `${sig}(${edge.label},${edge.oldPId})`;
      });
      const pId = this.insert(sig);
      this.pIds.new_pid.set(node.id, pId);
      this.pIds.j_pid.get(node.id).push(pId);
    })

    return;
  }

  private graphFromPIds(): SchemaSimpleGraph {
    const schemaGraph = SchemaSimpleGraph.instance;
    schemaGraph.emptyGraph();

    const schemaNodesMap = new Map(this.nodes.map((node) => {
      const simpleId = toSimpleId(node.type, this.pIds.new_pid.get(node.id).toString());
      return [simpleId,
        {
        id: simpleId,
        label: node.label,
        type: node.type,
      }]
    }));

    const edges = this.uniqEdges(this.edges.map((edge) => {
      const sourceNode = schemaNodesMap.get(toSimpleId(edge.sourceNode.type, this.pIds.new_pid.get(edge.sourceNode.id).toString()));
      const targetNode = schemaNodesMap.get(toSimpleId(edge.targetNode.type, this.pIds.new_pid.get(edge.targetNode.id).toString()));
      return {
        sourceNode: sourceNode,
        label: edge.label,
        targetNode: targetNode,
        type: edge.type
      }
    }))

    const splitEdges = this.groupBy(edges, "type");
    const splitNodes = this.groupBy([...schemaNodesMap.values()], "type");

    schemaGraph.nodeNodes = splitNodes["node"] ?? [];
    schemaGraph.edgeNodes = splitNodes["edge"] ?? [];
    schemaGraph.labelNodes = splitNodes["label"] ?? [];
    schemaGraph.propertyNodes = splitNodes["property"] ?? [];

    schemaGraph.edgeEdges = splitEdges["edge"] ?? [];
    schemaGraph.labelEdges = splitEdges["label"] ?? [];
    schemaGraph.propertyEdges = splitEdges["property"] ?? [];

    return schemaGraph;
  }
}