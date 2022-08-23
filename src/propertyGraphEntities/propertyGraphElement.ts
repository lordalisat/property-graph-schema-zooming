import type { Id } from "types/id";
import type { Label } from "types/label";
import type { Property } from "types/property";
import type { Value } from "types/propertyGraph/value";

export abstract class PropertyGraphElement {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  stringRepres?: string;
  readonly id!: Id;
  readonly labels!: Array<Label>;
  readonly properties!: Map<Property, Value>;

  public setPrintOptions(textWidth = 9, textHeight = 24) {
    const strings = [...this.labels, ...this.mapToStrings(this.properties)];
    if (strings.length === 0) strings.push(`\xa0*\xa0`);
    const maxLen = strings.reduce((prev, cur) => prev > cur.length ? prev : cur.length, 0);
    this.width = maxLen * textWidth;
    this.height = strings.length * textHeight;

    this.stringRepres = strings.join('\n');
  }

  private mapToStrings(m: Map<any, any>) {
    return Array.from(m).map(([k, v]) => { return `${k}: ${v}` });
  };
}
