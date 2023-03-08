import type { OpenAPI } from '@aomex/openapi-type';
import { magistrate } from './magistrate';

export type ValidateResult<T> = ValidateResultOK<T> | ValidateResultError;

export interface ValidateResultOK<T> {
  ok: T;
}

export interface ValidateResultError {
  errors: {
    path: string[];
    message: string;
  }[];
}

/**
 * Useless fields: [title, externalDocs]
 */
export type PartialOpenAPISchema = Pick<
  OpenAPI.SchemaObject,
  'description' | 'deprecated' | 'example'
>;

export interface ValidatorOptions<Type> {
  defaultValue?: Type | (() => Type);
  required: boolean;
  transform?: (value: any) => Promise<any> | any;
  docs?: PartialOpenAPISchema;
}

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

  export type Infer<T> = T extends Validator<infer Type>
    ? Validator.ConvertOptional<Type>
    : never;
}

export interface TransformedValidator<T> extends Validator<T> {}

export abstract class Validator<T = unknown> {
  public static $rootKey = Symbol('root').toString();

  protected readonly config: ValidatorOptions<T> = {
    required: true,
  };

  public static toDocument(validator: Validator): OpenAPI.ParameterBaseObject {
    const {
      required,
      docs: { description, deprecated, example, ...docs } = {},
      defaultValue,
    } = validator.config;
    const schema: OpenAPI.SchemaObject = {
      ...docs,
      default: validator.getDefaultValue(defaultValue),
      ...validator.toDocument(),
    };

    const result: OpenAPI.ParameterBaseObject = {
      required,
      ...{ description, deprecated, example },
      schema: schema,
    };

    return JSON.parse(JSON.stringify(result));
  }

  public static validate(
    validator: Validator,
    value: any,
    key: string = this.$rootKey,
    superKeys: string[] = [],
  ): Promise<ValidateResult<any>> {
    return validator.validate(value, key, superKeys);
  }

  public static isEmpty(validator: Validator, value: any): boolean {
    return validator.isEmpty(value);
  }

  /**
   * 生成openapi文档时使用到的额外数据
   */
  public docs(docs: PartialOpenAPISchema): this {
    this.config.docs = docs;
    return this;
  }

  /**
   * 数据选填。如果设置了`default(...)`，则已经是选填了。
   */
  protected optional(): Validator {
    this.config.required = false;
    return this;
  }

  /**
   * 验证成功后的回调函数，支持异步操作，返回的数据被作为最终数据。
   */
  protected transform<T1>(fn: (value: any) => Promise<T1> | T1): Validator {
    this.config.transform = fn;
    return this;
  }

  /**
   * Set default value and make data **optional**
   */
  protected default(value: any): Validator {
    this.optional();
    this.config.defaultValue = value;
    return this;
  }

  protected async validate(
    value: any,
    key: string,
    superKeys: string[],
  ): Promise<ValidateResult<any>> {
    const { defaultValue, required } = this.config;

    if (this.isEmpty(value)) {
      value = this.getDefaultValue(defaultValue);

      if (this.isEmpty(value)) {
        if (!required) return magistrate.ok(value);
        return magistrate.fail('required', key, superKeys);
      }
    }

    const result = await this.validateValue(value, key, superKeys);
    if (magistrate.noError(result) && this.config.transform) {
      result.ok = this.config.transform(result.ok);
    }
    return result;
  }

  protected isEmpty(value: any): boolean {
    return value == null || value === '';
  }

  protected getDefaultValue<T = any>(value: any): T | undefined {
    return typeof value === 'function' ? value() : value;
  }

  protected abstract validateValue(
    value: any,
    key: string,
    superKeys: string[],
  ): Promise<ValidateResult<any>> | ValidateResult<any>;

  protected toDocument(): OpenAPI.SchemaObject {
    return {};
  }
}
