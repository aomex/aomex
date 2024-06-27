import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import { magistrate, type TransformedValidator, Validator } from '../base';

export declare namespace EnumValidator {
  export interface Options<T> extends Validator.Options<T> {
    ranges: T[];
  }
}

export class EnumValidator<const T = never> extends Validator<T> {
  protected declare config: EnumValidator.Options<T>;

  constructor(ranges: T[] = []) {
    super();
    this.config.ranges = ranges;
    ranges.forEach((item) => {
      if (this.isEmpty(item)) {
        throw new Error(i18n.t('core.validator.enum.can_not_be_empty', { item }));
      }
      if (typeof item !== 'string' && typeof item !== 'number') {
        throw new Error(i18n.t('core.validator.enum.only_support_string_number'));
      }
    });
  }

  /**
   * 开启/关闭严格模式。开启后有如下限制：
   * - 枚举中包含数字时，如果传递的值为字符串类型，则不再转换为数字后再对比
   */
  public declare strict: (is?: boolean) => this;
  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => EnumValidator<T | Validator.TOptional>;
  public declare nullable: () => EnumValidator<T | null>;
  public declare default: (
    value: Validator.ParameterOrFn<T>,
  ) => EnumValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected validateValue(
    value: any,
    _key: string,
    label: string,
  ): magistrate.Result<any> {
    const { ranges, strict } = this.config;

    if (ranges.includes(value)) return magistrate.ok(value);

    if (!strict && typeof value === 'string') {
      const num = Number(value);
      if (!Number.isNaN(num)) {
        const matched = ranges.find((item) =>
          typeof item === 'number' ? item === num : false,
        );
        if (matched) return magistrate.ok(matched);
      }
    }

    return magistrate.fail(i18n.t('core.validator.enum.not_in_range', { label }));
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
