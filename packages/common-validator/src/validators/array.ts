import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';
import { toDocument } from '../api/to-document';

export declare namespace ArrayValidator {
  export type ItemOf<T> = Validator.ConvertOptional<T> extends (infer U)[] ? U : never;

  export interface Options<T> extends Validator.Options<T> {
    itemValidator?: Validator;
    lengthRange: { min?: number; max?: number };
    fromString?: string | RegExp;
    force?: {
      mode: 'separator' | 'block';
      separator?: string | RegExp;
    };
    /**
     * - `true`：整项比较（规则见 `unique()`）
     * - 函数：按抽取结果比较
     */
    uniqueBy?: true | ((item: any) => unknown);
  }

  export interface LengthRange {
    min?: number;
    max?: number;
  }
}

export class ArrayValidator<T = unknown[]> extends Validator<T> {
  declare protected config: ArrayValidator.Options<T>;

  constructor(validator?: Validator) {
    super();
    this.config.itemValidator = validator;
    this.config.lengthRange = {};
  }

  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => ArrayValidator<T | Validator.TOptional>;
  declare public nullable: () => ArrayValidator<T | null>;
  declare public default: (
    array: Validator.ParameterOrFn<T>,
  ) => ArrayValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
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

  /**
   * 校验数组元素唯一（不做深比较）。
   *
   * 比较规则与 `Set` / `Map` 的键相同：`NaN` 与 `NaN` 视为相同，`+0` 与 `-0` 视为相同；
   * 对象按引用判断，内容相同但不是同一引用不算重复。
   *
   * - 无参：整项比较，文档输出 `uniqueItems: true`
   * - 字符串：仅允许元素类型上的固定 key（`keyof`），不支持 `'a.b'` 路径；不写入 OpenAPI
   * - 函数：自定义抽取后再比较；不写入 OpenAPI
   */
  unique(): this;
  unique<K extends keyof ArrayValidator.ItemOf<T> & string>(
    key: ArrayValidator.ItemOf<T> extends object ? K : never,
  ): this;
  unique(by: (item: ArrayValidator.ItemOf<T>) => unknown): this;
  unique(by?: string | ((item: any) => unknown)) {
    const validator = this.copy();
    if (arguments.length === 0) {
      validator.config.uniqueBy = true;
    } else if (typeof by === 'string') {
      const key = by;
      validator.config.uniqueBy = (item) => item?.[key];
    } else {
      validator.config.uniqueBy = by!;
    }
    return validator;
  }

  protected async validateValue(
    value: any,
    key: string,
    label: string,
  ): Promise<ValidateResult.Any<any[]>> {
    const {
      force,
      lengthRange: { min = 0, max = Infinity },
      itemValidator,
      uniqueBy,
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
      return ValidateResult.deny(i18n.t('validator.array.must_be_array', { label }));
    }

    const length = items.length;

    if (length < min || length > max) {
      return ValidateResult.deny(
        i18n.t('validator.array.length_not_in_range', { label }),
      );
    }

    if (itemValidator) {
      let error: ValidateResult.Denied = {
        errors: [],
      };

      await Promise.all(
        items.map(async (_, index, arr) => {
          const result = await itemValidator['validate'](
            arr[index],
            index.toString(),
            label && key ? `${label}.${index}` : index.toString(),
          );

          if (ValidateResult.noError(result)) {
            arr[index] = result.data;
          } else {
            error.errors = error.errors.concat(result.errors!);
          }
        }),
      );

      if (error.errors.length) return error;
    }

    if (uniqueBy) {
      const seen = new Set<unknown>();
      const pick = uniqueBy === true ? (item: unknown) => item : uniqueBy;
      for (const item of items) {
        const fingerprint = pick(item);
        if (seen.has(fingerprint)) {
          return ValidateResult.deny(i18n.t('validator.array.not_unique', { label }));
        }
        seen.add(fingerprint);
      }
    }

    return ValidateResult.accept(items);
  }

  declare protected copy: () => ArrayValidator<T>;

  protected override nested(): Validator[] {
    const { itemValidator } = this.config;
    return itemValidator ? [itemValidator] : [];
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { itemValidator, lengthRange, uniqueBy } = this.config;

    return {
      type: 'array',
      items: (itemValidator && toDocument(itemValidator).schema) || {},
      minItems: lengthRange.min,
      maxItems: lengthRange.max,
      uniqueItems: uniqueBy === true || undefined,
    };
  }
}
