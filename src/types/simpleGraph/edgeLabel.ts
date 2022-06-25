import { Property } from "types/property";

export type EdgeLabel = Property | EdgeDirection | "label";

export enum EdgeDirection {
  "from",
  "to",
  "connects",
}
