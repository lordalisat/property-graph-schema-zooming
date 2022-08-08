import type { SimpleGraphNodeType } from "simpleGraphEntities/simpleGraphNode";
import type { EdgeLabel } from "types/simpleGraph/edgeLabel";
import type { PId } from "./pIdMaps";

export interface EdgeTId {
  source: SimpleGraphNodeType,
  label: EdgeLabel,
  oldPId: PId,
}