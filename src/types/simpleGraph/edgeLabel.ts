export type EdgeLabel = ValueType | EdgeDirection | "label";

export enum EdgeDirection {
    "from",
    "to",
    "connects"
}

export enum ValueType {
    "String",
    "Number",
    "Boolean"
}