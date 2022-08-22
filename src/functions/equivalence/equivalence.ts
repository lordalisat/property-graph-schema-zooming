import type { SimpleGraph } from "simpleGraphEntities/simpleGraph";

export abstract class Equivalence {
  public abstract calculateSchema(graph: SimpleGraph): SimpleGraph;
}