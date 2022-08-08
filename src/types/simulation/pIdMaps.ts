import type { SimpleId } from "../id";

export type PId = number;

export interface PIdMaps {
  old_pid: Map<SimpleId, PId>,
  new_pid: Map<SimpleId, PId>,
  j_pid: Map<SimpleId, Array<PId>>
}