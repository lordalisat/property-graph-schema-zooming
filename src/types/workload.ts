import type { Label } from "./label";

export type Workload = Array<{ label: Label, occurence: number }>;
export type FilteredWorkload = Set<Label>;
