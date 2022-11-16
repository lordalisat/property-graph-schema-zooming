import type { Label } from "types/label";
import type { Property, PropertyType } from "types/property";
import type { EdgeDirection } from "types/simpleGraph/edgeLabel";
import type { PId } from "./pIdMaps";

export type SignatureStorage = Map<{ labels: Label[], properties: Map<Property, PropertyType>, edges: Set<{label: EdgeDirection, pId: PId}> }, PId>;