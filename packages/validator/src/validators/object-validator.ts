import type { OpenAPI } from '@aomex/openapi-type';
import {
  magistrate,
  TransformedValidator,
  Validator,
  ValidatorOptions,
  ValidateResult,
  ValidateResultError,
} from '../base';

type ObjectProperty = Record<string, Validator>;

interface ObjectValidatorOptions<T> extends ValidatorOptions<T> {
  properties?: ObjectProperty;
  stringToObject?: boolean;
}

export class ObjectValidator<T = Validator.TObject> extends Validator<T> {
  protected declare config: ObjectValidatorOptions<T>;

  constructor(properties?: ObjectProperty) {
    super();
    this.config.properties = properties;
  }

  public declare optional: () => ObjectValidator<T | Validator.TOptional>;

  public declare default: (
    object: Validator.ParameterOrFn<T>,
  ) => ObjectValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  /**
   * 当数据为字符串时，是否尝试使用`JSON.parse`解析。默认：`false`
   */
  public parseFromString(is: boolean = true): this {
    this.config.stringToObject = is;
    return this;
  }

  protected isPlainObject(value: any): value is object {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  protected async validateValue(
    origin: Record<string, any>,
    key: string,
    superKeys: string[],
  ): Promise<ValidateResult<object>> {
    const { properties, stringToObject = false } = this.config;

    if (!this.isPlainObject(origin)) {
      let valid = false;
      if (stringToObject && typeof origin === 'string') {
        try {
          origin = JSON.parse(origin);
          valid = this.isPlainObject(origin);
        } catch {}
      }

      if (!valid) {
        return magistrate.fail('must be plain object', key, superKeys);
      }
    }

    let obj: Record<string, any> = {};

    if (properties) {
      const newSuperKeys = superKeys.concat(key);
      let error: ValidateResultError = {
        errors: [],
      };

      await Promise.all(
        Object.entries(properties).map(async ([propKey, validator]) => {
          const result = await Validator.validate(
            validator,
            origin[propKey],
            propKey,
            newSuperKeys,
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
