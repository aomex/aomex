import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';
import { toValidator, type ValidatorToken } from '../api/to-validator';

export declare namespace TupleValidator {
  export type Infer<T extends readonly unknown[]> = {
    -readonly [K in keyof T]: Validator.Infer<T[K]>;
  };

  export type ReplaceRest<T, Prefix, Item> = T extends
    Validator.TOptional | Validator.TDefault | null
    ? T
    : Prefix extends readonly unknown[]
      ? [...Prefix, ...Item[]]
      : T extends readonly unknown[]
        ? [...T, ...Item[]]
        : never;

  export type FixedPrefix<T, PreviousPrefix> = PreviousPrefix extends readonly unknown[]
    ? PreviousPrefix
    : Extract<T, readonly unknown[]>;

  export interface Options<T> extends Validator.Options<T> {
    tupleValidators: Validator[];
    restValidator?: Validator;
  }
}

export class TupleValidator<T = unknown[], FixedPrefix = undefined> extends Validator<T> {
  declare protected config: TupleValidator.Options<T>;

  constructor(tupleValidators: Validator[] = [], restValidator?: Validator) {
    super();
    this.config.tupleValidators = tupleValidators;
    this.config.restValidator = restValidator;
  }

  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => TupleValidator<T | Validator.TOptional, FixedPrefix>;
  declare public required: () => TupleValidator<
    Exclude<T, Validator.TOptional>,
    FixedPrefix
  >;
  declare public nullable: () => TupleValidator<T | null, FixedPrefix>;
  declare public default: (
    tuple: Validator.ParameterOrFn<T>,
  ) => TupleValidator<T | Validator.TDefault, FixedPrefix>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  /**
   * 使用指定规则校验固定位置之后的零个或多个元素；再次调用会替换尾项规则。
   */
  public rest<const R extends ValidatorToken>(
    validator: R,
  ): TupleValidator<
    TupleValidator.ReplaceRest<T, FixedPrefix, Validator.Infer<R>>,
    TupleValidator.FixedPrefix<T, FixedPrefix>
  > {
    const tuple = this.copy() as TupleValidator<
      TupleValidator.ReplaceRest<T, FixedPrefix, Validator.Infer<R>>,
      TupleValidator.FixedPrefix<T, FixedPrefix>
    >;
    tuple.config.restValidator = toValidator(validator);
    return tuple;
  }

  protected async validateValue(
    value: any,
    key: string,
    label: string,
  ): Promise<ValidateResult.Any<any[]>> {
    if (!Array.isArray(value)) {
      return ValidateResult.deny(i18n.t('validator.array.must_be_array', { label }));
    }

    const { tupleValidators, restValidator } = this.config;
    if (
      value.length < tupleValidators.length ||
      (!restValidator && value.length !== tupleValidators.length)
    ) {
      return ValidateResult.deny(
        i18n.t('validator.array.length_not_in_range', { label }),
      );
    }

    const results = await Promise.all(
      Array.from({ length: value.length }, (_, index) => {
        const validator =
          index < tupleValidators.length ? tupleValidators[index]! : restValidator!;
        return validator['validate'](
          value[index],
          index.toString(),
          label && key ? `${label}.${index}` : index.toString(),
        );
      }),
    );

    const output = value.slice();
    const errors: string[] = [];
    for (let index = 0; index < results.length; index++) {
      const result = results[index]!;
      if (ValidateResult.noError(result)) {
        output[index] = result.data;
      } else {
        errors.push(...result.errors!);
      }
    }

    return errors.length ? { errors } : ValidateResult.accept(output);
  }

  declare protected copy: () => TupleValidator<T, FixedPrefix>;

  protected override nested(): Validator[] {
    return this.config.restValidator
      ? [...this.config.tupleValidators, this.config.restValidator]
      : this.config.tupleValidators;
  }

  protected override copyConfig<TPrev, TPrevPrefix>(
    prev: TupleValidator<TPrev, TPrevPrefix>,
  ): this {
    super.copyConfig(prev);
    this.config.tupleValidators = prev.config.tupleValidators.slice();
    return this;
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const length = this.config.tupleValidators.length;
    return {
      type: 'array',
      // TODO: 升级到 OpenAPI 3.1 后，用 prefixItems 输出位置 schema，用 items 表达 rest。
      items: {},
      minItems: length,
      maxItems: this.config.restValidator ? undefined : length,
    };
  }
}
