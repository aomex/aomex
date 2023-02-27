import type { Validator } from '../base';

export interface LengthRange {
  min?: number;
  max?: number;
}

export interface MixinLength {
  length(exactLength: number): this;
  length(min: number, max: number): this;
  length(range: LengthRange): this;
}

export function mixinLength<T extends Validator>(
  validator: new (...args: any[]) => MixinLength & T,
  configKey: string = 'lengthRange',
) {
  validator.prototype['length'] = function (
    this: T,
    min: number | LengthRange,
    max?: number,
  ): T {
    // @ts-expect-error
    this.config[configKey] = getLengthRange(min, max);
    return this;
  };
}

const getLengthRange = (
  min: number | LengthRange,
  max?: number,
): LengthRange => {
  if (typeof min === 'number') {
    return {
      min: min,
      max: typeof max === 'number' ? max : min,
    };
  }

  return {
    min: typeof min.min === 'number' ? min.min : 1,
    max: min.max,
  };
};
