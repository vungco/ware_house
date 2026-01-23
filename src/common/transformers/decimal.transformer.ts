import { ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
  to(value?: number | null): string | null {
    if (value === null || value === undefined) return null;
    return value.toString();
  }
  from(value: string | null): number | null {
    if (value === null) return null;
    return Number(value);
  }
}
