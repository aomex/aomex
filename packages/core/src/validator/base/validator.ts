import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import { ValidateResult } from './validate-result';

export declare namespace Validator {
  export class TDefault {
    private _DEF_: '__default_value__';
  }
  export class TOptional {
    private _OPT_: '__optional_value__';
  }
  export class TObject {
    private _OBJ_: '__object_value__';
  }

  export type ConvertOptional<T> = TDefault extends T
    ? ConvertOptionalToNever<T>
    : ConvertOptionalToUndefined<T>;
  export type ConvertOptionalToUndefined<T> = T extends TOptional
    ? undefined
    : T extends TDefault
      ? never
      : T extends TObject
        ? object
        : T;
  export type ConvertOptionalToNever<T> = T extends TOptional | TDefault
    ? never
    : T extends TObject
      ? object
      : T;

  export interface TransformFn<T, T1> {
    (data: ConvertOptional<T>): Promise<T1> | T1;
  }

  export type ParameterOrFn<T> =
    | ConvertOptionalToNever<T>
    | (() => ConvertOptionalToNever<T>);

  export type Infer<T> =
    T extends Validator<infer Type>
      ? Validator.ConvertOptional<Type>
      : T extends { [K: string]: Validator }
        ? { [K in keyof T]: Infer<T[K]> }
        : never;

  export type PartialOpenAPISchema = Pick<
    OpenAPI.SchemaObject,
    'title' | 'description' | 'deprecated' | 'example' | 'externalDocs'
  >;

  export type DocumentMergeMode = 'merge' | 'replace';

  export interface Options<Type> {
    defaultValue?: Type | (() => Type);
    required: boolean;
    nullable: boolean;
    transform?: (value: any) => Promise<any> | any;
    docs?: PartialOpenAPISchema;
    strict: boolean;
  }
}

export interface TransformedValidator<T> extends Validator<T> {}

export abstract class Validator<T = unknown> {
  protected readonly SubClass: new (...args: any[]) => Validator;

  constructor() {
    // @ts-expect-error
    this.SubClass = new.target;
  }

  protected readonly config: Validator.Options<T> = {
    required: true,
    nullable: false,
    strict: false,
  };

  public static toDocument(validator: Validator): OpenAPI.ParameterBaseObject {
    const {
      required,
      nullable,
      docs: { description, deprecated, example, ...schemaProperties } = {},
      defaultValue,
    } = validator.config;
    const bothProperties = { description, deprecated, example };
    const schema: OpenAPI.SchemaObject = {
      ...schemaProperties,
      ...bothProperties,
      default: validator.getDefaultValue(defaultValue),
      nullable: nullable || undefined,
      ...validator.toDocument(),
    };

    const result: OpenAPI.ParameterBaseObject = {
      ...bothProperties,
      required: required || undefined,
      schema: schema,
    };

    return JSON.parse(JSON.stringify(result));
  }

  /**
   * @param is 是否开启，默认值：`true`
   */
  protected strict(is: boolean = true): this {
    const validator = this.copy();
    validator.config.strict = is;
    return validator as this;
  }

  /**
   * 扩展openapi的配置
   * - **replace:** 本次设置直接覆盖原来的扩展配置
   * - **merge:** 本次设置通过`Object.assign`的形式合并到原来的扩展配置
   * @param mode 默认值：`merge`
   */
  protected docs(
    docs: Validator.PartialOpenAPISchema,
    mode: Validator.DocumentMergeMode = 'merge',
  ): this {
    const validator = this.copy();
    validator.config.docs =
      mode === 'merge' ? { ...validator.config.docs, ...docs } : docs;
    return validator as this;
  }

  /**
   * 值如果是 `undefined, null, ''`或者没传入，以上情况会直接转换成`undefined`
   *
   * 注意：如果执行了`default(...)`，则无需再执行`optional()`
   *
   * 注意：如果设置了`nullable()`，则`null`不做处理
   */
  protected optional(): Validator {
    const validator = this.copy();
    validator.config.required = false;
    return validator;
  }

  /**
   * 把`null`识别成合法的值
   * @see optional
   */
  protected nullable(): Validator {
    const validator = this.copy();
    validator.config.nullable = true;
    return validator;
  }

  /**
   * 数据验证成功最后会触发该方法，你可以把数据转换成任何格式
   * ```typescript
   * // 最终返回类型：string
   * rule.string()
   * // 最终返回类型：Array<string>
   * rule.string().transform((value) => [value])
   * ```
   */
  protected transform<T1>(fn: (value: any) => Promise<T1> | T1): Validator {
    const validator = this.copy();
    validator.config.transform = fn;
    return validator;
  }

  /**
   * 如果值为空或者没传入，则使用该默认值，而且无需验证
   *
   * 注意：如果执行了`default(...)`，则无需再执行`optional()`
   */
  protected default(value: any): Validator {
    const validator = this.copy();
    validator.config.required = false;
    validator.config.defaultValue = value;
    return validator;
  }

  protected async validate(
    value: any,
    key: string = '',
    label: string = '',
  ): Promise<ValidateResult.Any<any>> {
    const { defaultValue, required } = this.config;

    if (this.isEmpty(value)) {
      value = this.getDefaultValue(defaultValue);
      if (this.isEmpty(value)) {
        if (!required)
          return ValidateResult.accept(
            this.config.transform ? await this.config.transform(value) : value,
          );
        return ValidateResult.deny(i18n.t('validator.required', { label }));
      }
    }

    if (this.isValidNull(value)) {
      return ValidateResult.accept(
        this.config.transform ? await this.config.transform(value) : value,
      );
    }

    const result = await this.validateValue(value, key, label);
    if (ValidateResult.noError(result) && this.config.transform) {
      result.data = await this.config.transform(result.data);
    }
    return result;
  }

  protected isEmpty(value: any): boolean {
    return (
      value === undefined || (!this.config.nullable && value === null) || value === ''
    );
  }

  protected isValidNull(value: any) {
    return value === null && this.config.nullable;
  }

  protected getDefaultValue<T = any>(value: any): T | undefined {
    return typeof value === 'function' ? value() : value;
  }

  protected abstract validateValue(
    value: any,
    key: string,
    label: string,
  ): Promise<ValidateResult.Any<any>> | ValidateResult.Any<any>;

  protected copy(): Validator {
    return new this.SubClass().copyConfig(this);
  }

  protected copyConfig(prev: Validator): this {
    // @ts-expect-error
    this.config = { ...prev.config };
    return this;
  }

  protected toDocument(): OpenAPI.SchemaObject {
    return {};
  }
}
