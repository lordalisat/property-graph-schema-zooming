/*
 * Based on the work of Luo, Y.
 * Designing algorithms for big graph datasets : a study of
 * computing bisimulation and joins
 * 2015
 */

import { SimpleGraph } from "simpleGraphEntities/simpleGraph";
import type { SimpleGraphEdgeType } from "simpleGraphEntities/simpleGraphEdge";
import type { SimpleGraphNodeType } from "simpleGraphEntities/simpleGraphNode";
import { type SimpleId, toSimpleId } from "types/id";
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
  };

  private insert(s: string): PId {
    if (this.storage.has(s)) {
      return this.storage.get(s);
    }
    this.currentPId++;
    this.storage.set(s, this.currentPId);
    return this.currentPId;
  }

  private getNodePid(
    node: SimpleGraphNodeType,
    edgeTIds: EdgeTId[]
  ): [SimpleId, number] {
    const pid_0 = this.pIds.j_pid_0.get(node.id).toString();
    const sigParts = edgeTIds
      .filter((edge) => edge.source.id === node.id)
      .map((edge) => `(${edge.label},${edge.oldPId})`);
    const sig = [pid_0, ...sigParts].join();
    const pId = this.insert(sig);
    return [node.id, pId];
  }

  private uniqEdgeTId(edgeTIds: Array<EdgeTId>) {
    const seen = {};
    return [
      ...new Map(
        edgeTIds.map((edge) => {
          const key = JSON.stringify(edge);
          return [key, edge];
        })
      ).values(),
    ];
  }

  private groupBy(arr, property) {
    return arr.reduce(function (split, item) {
      if (!split[item[property]]) {
        split[item[property]] = [];
      }
      split[item[property]].push(item);
      return split;
    }, {});
  }

  private uniqEdges(edges: Array<SimpleGraphEdgeType>) {
    const seen = {};
    return edges.filter((edge) => {
      const key = JSON.stringify(edge);
      return seen[key] ? false : (seen[key] = true);
    });
  }

  public calculateSchema(graph: SimpleGraph): SimpleGraph {
    console.time("calculateSchema");
    this.currentPId = 0;
    this.storage = new Map();

    this.nodes = [
      ...graph.nodeNodes.values(),
      ...graph.edgeNodes.values(),
      ...graph.labelNodes.values(),
      ...graph.propertyNodes.values(),
    ];
    this.edges = [
      ...graph.edgeEdges,
      ...graph.labelEdges,
      ...graph.propertyEdges,
    ];

    console.time(`build_bsim_${this.k}`);
    this.build_bsim(this.k);
    console.timeEnd(`build_bsim_${this.k}`);

    const schemaGraph = this.graphFromPIds();
    console.timeEnd("calculateSchema");
    return schemaGraph;
  }

  private build_bsim(k: number): void {
    if (k === 0) {
      this.pIds.j_pid_0 = new Map();
      this.nodes.sort((a, b) => a.label.localeCompare(b.label));
      let label: Label = this.nodes[0].label;
      this.nodes.forEach((node) => {
        if (node.label !== label) {
          this.currentPId++;
          label = node.label;
        }
        this.pIds.new_pid.set(node.id, this.currentPId);
        this.pIds.j_pid_0.set(node.id, this.currentPId);
      });
      return;
    }
    console.time(`build_bsim_${k - 1}`);
    this.build_bsim(k - 1);
    console.timeEnd(`build_bsim_${k - 1}`);
    this.pIds.old_pid = new Map(this.pIds.new_pid);

    console.time(`build_bsim_${k - 1}_get_unique_edges`);
    const outgoingEdgeTIds: Array<EdgeTId> = this.uniqEdgeTId(
      this.edges.map((edge) => {
        const oldPId = this.pIds.old_pid.get(edge.target.id);
        return {
          source: edge.source,
          label: edge.label,
          oldPId: oldPId,
        };
      })
    );
    const incomingEdgeTIds: Array<EdgeTId> = this.uniqEdgeTId(
      this.edges.map((edge) => {
        const oldPId = this.pIds.old_pid.get(edge.source.id);
        return {
          source: edge.target,
          label: edge.label,
          oldPId: oldPId,
        };
      })
    );
    console.timeEnd(`build_bsim_${k - 1}_get_unique_edges`);

    console.time(`build_bsim_${k - 1}_get_node_signatures`);
    const pIds = this.nodes.map((node) => {
      return this.getNodePid(node, [...outgoingEdgeTIds, ...incomingEdgeTIds]);
    });
    this.pIds.new_pid = new Map(pIds);
    this.pIds[`j_pid_${k}`] = new Map(pIds);
    console.timeEnd(`build_bsim_${k - 1}_get_node_signatures`);
  }

  private graphFromPIds(): SimpleGraph {
    console.time("graphFromPIds");
    const schemaGraph = new SimpleGraph();
    schemaGraph.emptyGraph();

    const schemaNodesMap = new Map(
      this.nodes.map((node) => {
        const simpleId = toSimpleId(
          node.type,
          this.pIds.new_pid.get(node.id).toString()
        );
        return [
          this.pIds.new_pid.get(node.id),
          {
            id: simpleId,
            label: node.label,
            type: node.type,
            x: node.x,
            y: node.y,
          },
        ];
      })
    );

    const edges = this.uniqEdges(
      this.edges.map((edge) => {
        const source = schemaNodesMap.get(
          this.pIds.new_pid.get(edge.source.id)
        );
        const target = schemaNodesMap.get(
          this.pIds.new_pid.get(edge.target.id)
        );
        return {
          source: source,
          label: edge.label,
          target: target,
          type: edge.type,
        };
      })
    );

    console.time("splitEdges");
    const splitEdges = this.groupBy(edges, "type");
    console.timeEnd("splitEdges");
    console.time("splitNodes");
    const splitNodes = this.groupBy([...schemaNodesMap.values()], "type");
    console.timeEnd("splitNodes");

    schemaGraph.nodeNodes = splitNodes[NodeType.node] ?? [];
    schemaGraph.edgeNodes = splitNodes[NodeType.edge] ?? [];
    schemaGraph.labelNodes = splitNodes[NodeType.label] ?? [];
    schemaGraph.propertyNodes = splitNodes[NodeType.propertyType] ?? [];

    schemaGraph.edgeEdges = splitEdges[EdgeType.edge] ?? [];
    schemaGraph.labelEdges = splitEdges[EdgeType.label] ?? [];
    schemaGraph.propertyEdges = splitEdges[EdgeType.property] ?? [];
    console.timeEnd("graphFromPIds");

    return schemaGraph;
  }
}
