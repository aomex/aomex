import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import { magistrate, type TransformedValidator, Validator } from '../base';

export declare namespace ObjectValidator {
  export type Property = Record<string, Validator>;

  export interface Options<T> extends Validator.Options<T> {
    properties?: Property;
    stringToObject?: boolean;
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
   * 尝试使用`JSON.parse`把字符串转换为对象，在非严格模式下自动开启。
   * @param is 默认值：`true`
   */
  public parseFromString(is: boolean = true): ObjectValidator<T> {
    const validator = this.copy();
    validator.config.stringToObject = is;
    return validator;
  }

  protected isPlainObject(value: any): value is object {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  protected async validateValue(
    origin: Record<string, any>,
    key: string,
    label: string,
  ): Promise<magistrate.Result<object>> {
    const { properties, stringToObject, strict } = this.config;

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
        return magistrate.fail(i18n.t('core.validator.object.must_be_object', { label }));
      }
    }

    let obj: Record<string, any> = {};

    if (properties) {
      const error: magistrate.Fail = {
        errors: [],
      };

      await Promise.all(
        Object.entries(properties).map(async ([propKey, validator]) => {
          const result = await validator['validate'](
            origin[propKey],
            propKey,
            label && key ? `${label}.${propKey}` : propKey,
          );

          if (magistrate.noError(result)) {
            obj[propKey] = result.ok;
          } else {
            error.errors = error.errors.concat(result.errors!);
          }
        }),
      );

      if (error.errors.length) return error;
    } else {
      Object.assign(obj, origin);
    }

    return magistrate.ok(obj);
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
    const { properties = {} } = this.config;

    const schemas: NonNullable<OpenAPI.SchemaObject['properties']> = {};
    const requiredProperties: string[] = [];
    Object.entries(properties).forEach(([key, validator]) => {
      const docs = Validator.toDocument(validator);
      schemas[key] = docs.schema!;
      docs.required && requiredProperties.push(key);
    });

    return {
      type: 'object',
      properties: Object.keys(schemas).length ? schemas : undefined,
      required: requiredProperties.length ? requiredProperties : undefined,
    };
  }
}
