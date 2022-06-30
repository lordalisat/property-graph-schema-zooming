import { InducedSimpleGraph, SchemaSimpleGraph } from "simpleGraphEntities/simpleGraph";

export abstract class Equivalence {
  public abstract calculateSchema(graph: InducedSimpleGraph): SchemaSimpleGraph;
}