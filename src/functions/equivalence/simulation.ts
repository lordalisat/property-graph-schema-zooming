import { InducedSimpleGraph, SchemaSimpleGraph } from "simpleGraphEntities/simpleGraph";
import { Equivalence } from "./equivalence";

export class Simulation extends Equivalence{
  public calculateSchema(graph: InducedSimpleGraph): SchemaSimpleGraph {
    const schemaGraph = SchemaSimpleGraph.instance;
    schemaGraph.emptyGraph();

    return schemaGraph;
  }
}