import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import { magistrate, type TransformedValidator, Validator } from '../base';

export declare namespace ArrayValidator {
  export interface Options<T> extends Validator.Options<T> {
    itemValidator?: Validator;
    lengthRange: { min?: number; max?: number };
    fromString?: string | RegExp;
    force?: {
      mode: 'separator' | 'block';
      separator?: string | RegExp;
    };
  }

  export interface LengthRange {
    min?: number;
    max?: number;
  }
}

export class ArrayValidator<T = unknown[]> extends Validator<T> {
  protected declare config: ArrayValidator.Options<T>;

  constructor(validator?: Validator) {
    super();
    this.config.itemValidator = validator;
    this.config.lengthRange = {};
  }

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => ArrayValidator<T | Validator.TOptional>;
  public declare nullable: () => ArrayValidator<T | null>;
  public declare default: (
    array: Validator.ParameterOrFn<T>,
  ) => ArrayValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  /**
   * 强制将`非数组`的值转换成数组类型。控制台命令行和url查询字符串场景下，如果只传了一个元素，则有可能被识别为非数组，而传递多个元素时又变成了数组结构。
   *
   * @param mode 转换模式
   *
   * - `separator` 使用分割符号，把字符串拆分成数组
   * - `block` 把输入当成一个整体，作为数组的一个元素
   *
   * @param separator 分割符号，默认值：`new RegExp('\s*,\s*')`
   */
  forceToArray(mode: 'separator', separator?: string | RegExp): ArrayValidator<T>;
  forceToArray(mode: 'block'): ArrayValidator<T>;
  forceToArray(
    mode: 'separator' | 'block',
    separator?: string | RegExp,
  ): ArrayValidator<T> {
    const validator = this.copy();
    validator.config.force = { mode, separator };
    return validator;
  }

  length(exactLength: number): this;
  length(range: ArrayValidator.LengthRange): this;
  length(data: number | ArrayValidator.LengthRange) {
    const validator = this.copy();
    validator.config.lengthRange =
      typeof data === 'number' ? { min: data, max: data } : data;
    return validator;
  }

  protected async validateValue(
    value: any,
    key: string,
    label: string,
  ): Promise<magistrate.Result<any[]>> {
    const {
      force,
      lengthRange: { min = 0, max = Infinity },
      itemValidator,
    } = this.config;
    let items: any[] | undefined;
    if (Array.isArray(value)) {
      items = value.slice();
    } else if (force) {
      const { mode, separator = /\s*,\s*/ } = force;
      switch (mode) {
        case 'block':
          items = [value];
          break;
        case 'separator':
          if (typeof value === 'string') {
            items = value.split(separator);
          }
          break;
      }
    }

    if (!Array.isArray(items)) {
      return magistrate.fail(i18n.t('validator.array.must_be_array', { label }));
    }

    const length = items.length;

    if (length < min || length > max) {
      return magistrate.fail(i18n.t('validator.array.length_not_in_range', { label }));
    }

    if (itemValidator) {
      let error: magistrate.Fail = {
        errors: [],
      };

      await Promise.all(
        items.map(async (_, index, arr) => {
          const result = await itemValidator['validate'](
            arr[index],
            index.toString(),
            label && key ? `${label}.${index}` : index.toString(),
          );

          if (magistrate.noError(result)) {
            arr[index] = result.ok;
          } else {
            error.errors = error.errors.concat(result.errors!);
          }
        }),
      );

      if (error.errors.length) return error;
    }

    return magistrate.ok(items);
  }

  protected declare copy: () => ArrayValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    const { itemValidator, lengthRange } = this.config;

    return {
      type: 'array',
      items: (itemValidator && Validator.toDocument(itemValidator).schema) || {},
      minItems: lengthRange.min,
      maxItems: lengthRange.max,
    };
  }
}
