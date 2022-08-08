import type { SimpleGraphNodeType } from "src/simpleGraphEntities/simpleGraphNode";
import type { EdgeLabel } from "../simpleGraph/edgeLabel";
import type { PId } from "./pIdMaps";

export interface EdgeTId {
  sourceNode: SimpleGraphNodeType,
  label: EdgeLabel,
  oldPId: PId,
}