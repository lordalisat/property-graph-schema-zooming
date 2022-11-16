import type { SimpleId } from "types/id";

export type PId = number;
export type j_pid = `j_pid_${number}`;
export type PIdMap = Map<SimpleId, PId>;

export interface PIdMaps {
  old_pid: PIdMap,
  new_pid: PIdMap,
  [j_pid: j_pid]: PIdMap
}