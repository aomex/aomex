import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';

export declare namespace EnumValidator {
  export interface Options<T> extends Validator.Options<T> {
    ranges: T[];
  }
}

export class EnumValidator<const T = never> extends Validator<T> {
  declare protected config: EnumValidator.Options<T>;

  constructor(ranges: T[] = []) {
    super();
    this.config.ranges = ranges;
    ranges.forEach((item) => {
      if (this.isEmpty(item)) {
        throw new Error(i18n.t('validator.enum.can_not_be_empty', { item }));
      }
      if (typeof item !== 'string' && typeof item !== 'number') {
        throw new Error(i18n.t('validator.enum.only_support_string_number'));
      }
    });
  }

  /**
   * 开启/关闭严格模式。开启后有如下限制：
   * - 枚举中包含数字时，如果传递的值为字符串类型，则不再转换为数字后再对比
   */
  declare public strict: (is?: boolean) => this;
  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => EnumValidator<T | Validator.TOptional>;
  declare public nullable: () => EnumValidator<T | null>;
  declare public default: (
    value: Validator.ParameterOrFn<T>,
  ) => EnumValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected validateValue(
    value: any,
    _key: string,
    label: string,
  ): ValidateResult.Any<any> {
    const { ranges, strict } = this.config;

    if (ranges.includes(value)) return ValidateResult.accept(value);

    if (!strict && typeof value === 'string') {
      const num = Number(value);
      if (!Number.isNaN(num)) {
        const matched = ranges.find((item) =>
          typeof item === 'number' ? item === num : false,
        );
        if (matched) return ValidateResult.accept(matched);
      }
    }

    return ValidateResult.deny(i18n.t('validator.enum.not_in_range', { label }));
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { ranges } = this.config;
    const types = ranges.map((value) => typeof value) as Array<'string' | 'number'>;

    return {
      type: new Set(types).size === 1 ? types[0] : undefined,
      enum: ranges,
    };
  }
}
