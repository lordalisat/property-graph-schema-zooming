import type { SimulationNodeDatum } from "d3";
import type { Id } from "types/id";
import type { Label } from "types/label";
import type { Property } from "types/property";
import type { elementType } from "types/propertyGraph/elementType";
import type { Value } from "types/propertyGraph/value";

export abstract class PropertyGraphElement implements SimulationNodeDatum {
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  width?: number;
  height?: number;
  stringRepres?: string;
  readonly id!: Id;
  readonly labels!: Array<Label>;
  readonly properties!: Map<Property, Value>;
  readonly type!: elementType;

  public setPrintOptions(textWidth = 9, textHeight = 24) {
    const labels = this.labels.map((label) => `<b>${label}</b>`);
    const properties = this.mapToStrings(this.properties);
    const strings = [...labels, ...properties];
    if (strings.length === 0) strings.push(`\xa0*\xa0`);
    const maxLen = strings.reduce(
      (prev, cur) => (prev > cur.length ? prev : cur.length),
      0
    );
    this.width = maxLen * textWidth;
    this.height = strings.length * textHeight;

    this.stringRepres = strings.join("\n");
  }

  private mapToStrings(m: Map<string, Value>) {
    return Array.from(m).map(([k, v]) => {
      return `<i>${k}</i>: ${v}`;
    });
  }
}
