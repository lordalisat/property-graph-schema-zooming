import type { Property } from "types/property";

export type EdgeLabel = Property | EdgeDirection | "label";

export enum EdgeDirection {
  "from" = "from",
  "to" = "to",
  "connects1" = "connects1",
  "connects2" = "connects2"
}
