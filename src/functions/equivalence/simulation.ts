import { SimpleGraph } from "simpleGraphEntities/simpleGraph";
import type { SimpleGraphEdgeType } from "simpleGraphEntities/simpleGraphEdge";
import type { SimpleGraphNodeType } from "simpleGraphEntities/simpleGraphNode";
import { toSimpleId } from "types/id";
import type { Label } from "types/label";
import { EdgeType } from "types/simpleGraph/edgeType";
import { NodeType } from "types/simpleGraph/nodeType";
import type { EdgeTId } from "types/simulation/edgeTId";
import type { PId, PIdMaps } from "types/simulation/pIdMaps";
import type { SignatureStorage } from "types/simulation/signatureStorage";
import { Equivalence } from "./equivalence";

export class Simulation extends Equivalence {
  private currentPId: PId;
  private storage: SignatureStorage;
  private k = 3;
  private nodes: SimpleGraphNodeType[];
  private edges: SimpleGraphEdgeType[];
  private pIds: PIdMaps = {
    old_pid: new Map(),
    new_pid: new Map(),
    j_pid: new Map(),
  };

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
      return seen[key] ? false : (seen[key] = true);
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
      return seen[key] ? false : (seen[key] = true);
    })
  }

  public calculateSchema(graph: SimpleGraph): SimpleGraph {
    this.currentPId = 0;
    this.storage = new Map();

    this.nodes = [...graph.nodeNodes.values(), ...graph.edgeNodes.values(), ...graph.labelNodes.values(), ...graph.propertyNodes.values()];
    this.edges = [...graph.edgeEdges, ...graph.labelEdges, ...graph.propertyEdges];

    this.build_bsim(this.k);

    return this.graphFromPIds();
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
    this.build_bsim(k - 1);
    this.pIds.old_pid = new Map(this.pIds.new_pid);

    const edgeTIds: Array<EdgeTId> = this.uniqEdgeTId(this.edges.map((edge) => {
      const oldPId = this.pIds.old_pid.get(edge.target.id);
      return {
        source: edge.source,
        label: edge.label,
        oldPId: oldPId,
      }
    }));

    this.nodes.forEach((node) => {
      let sig = this.pIds.j_pid.get(node.id)[0].toString();
      edgeTIds.filter((edge) => edge.source.id === node.id).forEach((edge) => {
        sig = `${sig}(${edge.label},${edge.oldPId})`;
      });
      const pId = this.insert(sig);
      this.pIds.new_pid.set(node.id, pId);
      this.pIds.j_pid.get(node.id).push(pId);
    })
  }

  private graphFromPIds(): SimpleGraph {
    const schemaGraph = new SimpleGraph;
    schemaGraph.emptyGraph();

    const schemaNodesMap = new Map(this.nodes.map((node) => {
      const simpleId = toSimpleId(node.type, this.pIds.new_pid.get(node.id).toString());
      return [this.pIds.new_pid.get(node.id),
        {
        id: simpleId,
        label: node.label,
        type: node.type,
      }]
    }));

    const edges = this.uniqEdges(this.edges.map((edge) => {
      const source = schemaNodesMap.get(this.pIds.new_pid.get(edge.source.id));
      const target = schemaNodesMap.get(this.pIds.new_pid.get(edge.target.id));
      return {
        source: source,
        label: edge.label,
        target: target,
        type: edge.type
      }
    }))

    const splitEdges = this.groupBy(edges, "type");
    const splitNodes = this.groupBy([...schemaNodesMap.values()], "type");

    schemaGraph.nodeNodes = splitNodes[NodeType.node] ?? [];
    schemaGraph.edgeNodes = splitNodes[NodeType.edge] ?? [];
    schemaGraph.labelNodes = splitNodes[NodeType.label] ?? [];
    schemaGraph.propertyNodes = splitNodes[NodeType.propertyType] ?? [];

    schemaGraph.edgeEdges = splitEdges[EdgeType.edge] ?? [];
    schemaGraph.labelEdges = splitEdges[EdgeType.label] ?? [];
    schemaGraph.propertyEdges = splitEdges[EdgeType.property] ?? [];

    return schemaGraph;
  }
}