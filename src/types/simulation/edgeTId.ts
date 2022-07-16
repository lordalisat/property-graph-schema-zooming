import { SimpleGraphNodeType } from "simpleGraphEntities/simpleGraphNode";
import { EdgeLabel } from "types/simpleGraph/edgeLabel";
import { PId } from "./pIdMaps";

export interface EdgeTId {
  sourceNode: SimpleGraphNodeType,
  label: EdgeLabel,
  oldPId: PId,
}