import { EdgeLabel } from "./edgeLabel";
import { Id } from "../id";

export type EdgeType = Set<{nodeId: Id, edgeLabel: EdgeLabel}>;