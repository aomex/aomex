import { toArray } from '@aomex/internal-tools';
import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';

export declare namespace ObjectValidator {
  export type Property = Record<string, Validator>;

  export interface Options<T> extends Validator.Options<T> {
    properties?: Property;
    stringToObject?: boolean;
    keepAdditional?: boolean | { key?: RegExp[]; value?: Validator };
  }
}

export class ObjectValidator<T = Validator.TObject> extends Validator<T> {
  protected declare config: ObjectValidator.Options<T>;

  constructor(properties?: ObjectValidator.Property) {
    super();
    this.config.properties = properties;
  }

  /**
   * 开启严格模式后：
   * - 不从字符串解析出对象，除非通过`parseFromString()`手动指定
   */
  public declare strict: (is?: boolean) => this;

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => ObjectValidator<T | Validator.TOptional>;
  public declare nullable: () => ObjectValidator<T | null>;
  public declare default: (
    object: Validator.ParameterOrFn<T>,
  ) => ObjectValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  /**
   * 尝试使用`JSON.parse`把字符串转换为对象，在非严格模式下默认开启
   */
  public parseFromString(is: boolean = true): ObjectValidator<T> {
    const validator = this.copy();
    validator.config.stringToObject = is;
    return validator;
  }

  /**
   * 保留未被验证的键值对。对象中包含动态字段时，无法使用具体的结构体描述出对象的组成。
   *
   * 有以下几种保留规则：
   * 1. 不提供参数，则保留所有的属性和值；
   * 2. 提供`key`，则保留 键 能匹配正则表达式的键值对；
   * 3. 提供`value`，则保留 值 能匹配验证器的键值对，同时值会根据验证器逻辑做相应的修正；
   * 4. 提供`key`和`value`，则保留能同时满足规则2和3的键值对。
   *
   * ```typescript
   * const v = rule.object();
   *
   * // { a: 'x', b: 1, c: true } -> { a: 'x', b: 1, c: true }
   * v.additional();
   *
   * // { a: 'x', b: 1, c: true } -> { a: 'x' }
   * v.additional({ value: rule.string() });
   *
   * // { a: 'x', b: 1, c: true } -> { a: 'x', c: true }
   * v.additional({ key: /^(a|c)$/ });
   *
   * // { a: 'x', b: 1, c: true } -> { c: true }
   * v.additional({ key: /^(a|c)$/, value: rule.boolean() });
   *
   * // { a: 'x', b: 1, c: true } -> { }
   * v.additional({ key: /^(a|c)$/, value: rule.number() });
   * ```
   */
  public additional(): ObjectValidator<
    T extends Validator.TObject
      ? { [K: string]: unknown }
      : T extends null
        ? null
        : T & { [K: string]: unknown }
  >;
  public additional(opts: {
    key: RegExp | RegExp[];
    value?: undefined;
  }): ObjectValidator<
    (T extends Validator.TObject ? unknown : T) & { [K: string]: unknown }
  >;
  public additional<Additional extends Validator>(opts: {
    key?: RegExp | RegExp[];
    value: Additional;
  }): ObjectValidator<
    T extends Validator.TObject
      ? { [K: string]: Validator.Infer<Additional> }
      : T extends null
        ? null
        : T & { [K: string]: Validator.Infer<Additional> }
  >;
  public additional(
    opts: {
      key?: RegExp | RegExp[];
      value?: Validator;
    } = {},
  ): ObjectValidator<any> {
    const validator = this.copy();
    const keys = opts.key ? toArray(opts.key) : [];
    const key = keys.length ? keys : undefined;
    const value = opts.value;
    validator.config.keepAdditional = !value && !key ? true : { key, value };
    return validator;
  }

  protected isPlainObject(value: any): value is object {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  protected async validateValue(
    origin: Record<string, any>,
    key: string,
    label: string,
  ): Promise<ValidateResult.Any<object>> {
    const { properties, stringToObject, strict, keepAdditional = false } = this.config;

    if (!this.isPlainObject(origin)) {
      let valid = false;
      if (
        ((!strict && stringToObject !== false) || (strict && stringToObject)) &&
        typeof origin === 'string'
      ) {
        try {
          origin = JSON.parse(origin);
          valid = this.isPlainObject(origin);
        } catch {}
      }
      if (!valid) {
        return ValidateResult.deny(i18n.t('validator.object.must_be_object', { label }));
      }
    }

    let obj: Record<string, any> = {};

    if (properties) {
      const error: ValidateResult.Denied = {
        errors: [],
      };

      await Promise.all(
        Object.entries(properties).map(async ([propKey, validator]) => {
          const result = await validator['validate'](
            origin[propKey],
            propKey,
            label && key ? `${label}.${propKey}` : propKey,
          );

          if (ValidateResult.noError(result)) {
            obj[propKey] = result.data;
          } else {
            error.errors = error.errors.concat(result.errors!);
          }
        }),
      );

      if (error.errors.length) return error;
    }

    if (keepAdditional) {
      const trustedKeys = properties ? Object.keys(properties) : [];
      for (const propKey of Object.keys(origin)) {
        if (trustedKeys.includes(propKey)) continue;
        if (keepAdditional === true) {
          obj[propKey] = origin[propKey];
          continue;
        }
        if (keepAdditional.key) {
          if (keepAdditional.key.every((reg) => !reg.test(propKey))) continue;
        }
        if (keepAdditional.value) {
          const result = await keepAdditional.value['validate'](origin[propKey], propKey);
          if (ValidateResult.noError(result)) {
            obj[propKey] = result.data;
          }
        } else {
          obj[propKey] = origin[propKey];
        }
      }
    }

    if (!properties && !keepAdditional) {
      Object.assign(obj, origin);
    }

    return ValidateResult.accept(obj);
  }

  protected declare copy: () => ObjectValidator<T>;

  protected override copyConfig(prev: ObjectValidator): this {
    super.copyConfig(prev);
    this.config.properties = prev.config.properties && {
      ...prev.config.properties,
    };
    return this;
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { properties = {}, keepAdditional } = this.config;

    const hasSpecificProperties = !!Object.keys(properties).length;
    const schemas: NonNullable<OpenAPI.SchemaObject['properties']> = {};
    const requiredProperties: string[] = [];
    if (hasSpecificProperties) {
      Object.entries(properties).forEach(([key, validator]) => {
        const docs = Validator.toDocument(validator);
        schemas[key] = docs.schema!;
        docs.required && requiredProperties.push(key);
      });
    }

    let additionalProperties: OpenAPI.SchemaObject['additionalProperties'];
    if (keepAdditional === undefined) {
      additionalProperties = !hasSpecificProperties;
    } else if (typeof keepAdditional === 'boolean') {
      additionalProperties = keepAdditional;
    } else if (!keepAdditional.value) {
      additionalProperties = true;
    } else {
      additionalProperties = Validator.toDocument(keepAdditional.value).schema;
    }

    return {
      type: 'object',
      properties: hasSpecificProperties ? schemas : undefined,
      required: requiredProperties.length ? requiredProperties : undefined,
      additionalProperties,
    };
  }
}
