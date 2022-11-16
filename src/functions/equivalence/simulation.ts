/*
 * Based on the work of Luo, Y.
 * Designing algorithms for big graph datasets : a study of
 * computing bisimulation and joins
 * 2015
 */

import { SimpleGraph } from "simpleGraphEntities/simpleGraph";
import {
  SimpleGraphEdge,
  type SimpleGraphEdgeType,
} from "simpleGraphEntities/simpleGraphEdge";
import { SimpleGraphNode } from "simpleGraphEntities/simpleGraphNode";
import { toSimpleId } from "types/id";
import type { Label } from "types/label";
import type { Property, PropertyType } from "types/property";
import type { EdgeDirection } from "types/simpleGraph/edgeLabel";
import { NodeType } from "types/simpleGraph/nodeType";
import type { PId, PIdMap, PIdMaps } from "types/simulation/pIdMaps";
import type { SignatureStorage } from "types/simulation/signatureStorage";
import { Equivalence } from "./equivalence";

export class Simulation extends Equivalence {
  private currentPId: PId;
  private storage: SignatureStorage;
  private k = 0;
  private graph: SimpleGraph;
  private pIds: PIdMaps = {
    old_pid: new Map(),
    new_pid: new Map(),
  };

  private insert(
    labels: Label[],
    properties: Map<Property, PropertyType>,
    edges: Set<{ label: EdgeDirection; pId: PId }>
  ): PId {
    const pID = [...this.storage.entries()].find(
      (val) => 
        JSON.stringify(val[0].labels) === JSON.stringify(labels) &&
        JSON.stringify(Object.fromEntries(val[0].properties)) ===
        JSON.stringify(Object.fromEntries(properties)) &&
        JSON.stringify(Array.from(edges)) === JSON.stringify(Array.from(val[0].edges))
    );
    if (pID) {
      return pID[1];
    }
    this.currentPId++;
    this.storage.set({ labels, properties, edges }, this.currentPId);
    return this.currentPId;
  }

  private getPId(
    labels: SimpleGraphEdgeType[],
    properties: SimpleGraphEdgeType[],
    edges: Set<{ label: EdgeDirection; pId: PId }>
  ): PId {
    const pId = this.insert(
      labels.map((edge) => edge.target.label),
      new Map(
        properties.map((edge) => [
          edge.label,
          edge.target.label as PropertyType,
        ])
      ),
      edges
    );
    return pId;
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
    this.graph = graph;

    console.time(`build_bsim_${this.k}`);
    this.build_bsim(this.k);
    console.timeEnd(`build_bsim_${this.k}`);

    const schemaGraph = this.graphFromPIds();
    console.timeEnd("calculateSchema");
    return schemaGraph;
  }

  private build_bsim(k: number): void {
    if (k === 0) {
      console.time("build_bsim_nodes_k_0");
      this.storage = new Map();
      this.pIds.new_pid = new Map(
        [...this.graph.nodeNodes.values()].map((node) => {
          const pId = this.getPId(
            this.graph.labelEdges.filter((edge) => edge.source === node),
            this.graph.propertyEdges.filter((edge) => edge.source === node),
            new Set()
          );
          return [node.id, pId];
        })
      );
      console.timeEnd("build_bsim_nodes_k_0");
      return;
    }
    this.build_bsim(k - 1);
    this.pIds.old_pid = new Map(this.pIds.new_pid);

    console.time(`build_bsim_${k - 1}_get_unique_edges`);
    this.storage = new Map();

    const edgeTIds: PIdMap = this.getEdgeTIds();
    console.timeEnd(`build_bsim_${k - 1}_get_unique_edges`);

    console.timeEnd(`build_bsim_${k - 1}_get_node_signatures`);
    this.storage = new Map();

    this.pIds.new_pid = new Map(
    [...this.graph.nodeNodes.values()].map((node) => {
      const edges = this.graph.edgeEdges
        .filter((edge) => edge.target === node)
        .map((edge) => ({
          label: edge.label as EdgeDirection,
          pId: edgeTIds.get(edge.source.id),
        }));
        const pId = this.getPId(
          this.graph.labelEdges.filter((edge) => edge.source === node),
          this.graph.propertyEdges.filter((edge) => edge.source === node),
          new Set(edges)
        );
        return [node.id, pId];
      })
    );
    console.time(`build_bsim_${k - 1}_get_node_signatures`);
  }

  private getEdgeTIds(): PIdMap {
    return new Map(
      [...this.graph.edgeNodes.values()].map((node) => {
        const edges = this.graph.edgeEdges
          .filter((edge) => edge.source === node)
          .map((edge) => ({
            label: edge.label as EdgeDirection,
            pId: this.pIds.new_pid.get(edge.target.id),
          }));
        const pId = this.getPId(
          this.graph.labelEdges.filter((edge) => edge.source === node),
          this.graph.propertyEdges.filter((edge) => edge.source === node),
          new Set(edges)
        );
        return [node.id, pId];
      })
    );
  }

  private graphFromPIds(): SimpleGraph {
    console.time("graphFromPIds");
    const schemaGraph = new SimpleGraph();
    schemaGraph.emptyGraph();

    schemaGraph.labelNodes = new Map(this.graph.labelNodes);
    schemaGraph.propertyNodes = new Map(this.graph.propertyNodes);

    const edgeTIds = this.getEdgeTIds();
    console.log(edgeTIds);

    schemaGraph.edgeNodes = new Map(
      [...edgeTIds.values()].map((node) => {
        const simpleId = toSimpleId(NodeType.edge, node.toString());
        return [simpleId, SimpleGraphNode.edgeNode(simpleId)];
      })
    );

    schemaGraph.nodeNodes = new Map(
      [...this.pIds.new_pid.values()].map((node) => {
        const simpleId = toSimpleId(NodeType.node, node.toString());
        return [simpleId, SimpleGraphNode.nodeNode(simpleId)];
      })
    );

    schemaGraph.labelEdges = this.uniqEdges(
      this.graph.labelEdges.map((edge) => {
        const source =
          edge.source.type === NodeType.node
            ? schemaGraph.nodeNodes.get(
                toSimpleId(
                  NodeType.node,
                  this.pIds.new_pid.get(edge.source.id).toString()
                )
              )
            : schemaGraph.edgeNodes.get(
                toSimpleId(
                  NodeType.edge,
                  edgeTIds.get(edge.source.id).toString()
                )
              );
        return SimpleGraphEdge.labelEdge(source, edge.target);
      })
    );
    schemaGraph.propertyEdges = this.uniqEdges(
      this.graph.propertyEdges.map((edge) => {
        const source =
          edge.source.type === NodeType.node
            ? schemaGraph.nodeNodes.get(
                toSimpleId(
                  NodeType.node,
                  this.pIds.new_pid.get(edge.source.id).toString()
                )
              )
            : schemaGraph.edgeNodes.get(
                toSimpleId(
                  NodeType.edge,
                  edgeTIds.get(edge.source.id).toString()
                )
              );
        return SimpleGraphEdge.propertyEdge(source, edge.target, edge.label);
      })
    );
    schemaGraph.edgeEdges = this.uniqEdges(
      this.graph.edgeEdges.map((edge) => {
        const source = schemaGraph.edgeNodes.get(
          toSimpleId(
            NodeType.edge,
            edgeTIds.get(edge.source.id).toString()
          )
        );
        const target = schemaGraph.nodeNodes.get(
          toSimpleId(
            NodeType.node,
            this.pIds.new_pid.get(edge.target.id).toString()
          )
        );
        return SimpleGraphEdge.edgeEdge(
          source,
          target,
          edge.label as EdgeDirection
        );
      })
    );
    console.timeEnd("graphFromPIds");

    console.log(schemaGraph);

    return schemaGraph;
  }
}
