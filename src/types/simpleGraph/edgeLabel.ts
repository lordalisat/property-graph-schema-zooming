import type { Property } from "../property";

export type EdgeLabel = Property | EdgeDirection | "label";

export enum EdgeDirection {
  "from" = "from",
  "to" = "to",
  "connects" = "connects",
}
