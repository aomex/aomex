import type { OpenAPI } from '@aomex/openapi-type';
import {
  magistrate,
  TransformedValidator,
  BaseStringValidatorOptions,
  BaseStringValidator,
  ValidateResult,
  Validator,
} from '../base';

export declare namespace UuidValidator {
  export type Version = (typeof UuidValidator.versions)[number];
}

interface UuidValidatorOptions<T = string>
  extends BaseStringValidatorOptions<T> {
  uuidVersion: UuidValidator.Version[];
}

const createRegexp = (version: number | 'all') => {
  const group = '[0-9a-f]';
  const diff = version === 'all' ? `${group}{4}` : `${version}${group}{3}`;
  return new RegExp(
    `^${group}{8}-${group}{4}-${diff}-[89ab]${group}{3}-${group}{12}$`,
    'i',
  );
};

export class UuidValidator<T = string> extends BaseStringValidator<T> {
  public static versions = <const>['v1', 'v2', 'v3', 'v4', 'v5'];

  public static patterns: {
    [key in UuidValidator.Version | 'all']: RegExp;
  } = {
    v1: createRegexp(1),
    v2: createRegexp(2),
    v3: createRegexp(3),
    v4: createRegexp(4),
    v5: createRegexp(5),
    all: createRegexp('all'),
  };

  protected declare config: UuidValidatorOptions<T>;

  constructor(versions: UuidValidator.Version[]) {
    super();
    this.config.uuidVersion = versions;
  }

  public declare optional: () => UuidValidator<T | Validator.TOptional>;

  public declare default: (
    uuid: Validator.ParameterOrFn<T>,
  ) => UuidValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  public declare match: (pattern: RegExp) => this;

  protected validateValue(
    uuid: string,
    key: string,
    superKeys: string[],
  ): ValidateResult<string> {
    const { uuidVersion } = this.config;
    let checker: ValidateResult<string> | void;

    checker = this.shouldBeString(uuid, key, superKeys);
    if (checker) return checker;

    uuid = this.getTrimValue(uuid);
    checker = this.shouldMatchPattern(uuid, key, superKeys);
    if (checker) return checker;

    let valid = false;
    if (uuidVersion.length === UuidValidator.versions.length) {
      valid = UuidValidator.patterns.all.test(uuid);
    } else {
      for (let i = uuidVersion.length; i-- > 0; ) {
        if (UuidValidator.patterns[uuidVersion[i]!].test(uuid)) {
          valid = true;
          break;
        }
      }
    }

    if (!valid) {
      return magistrate.fail(
        `must be UUID[${uuidVersion.join(',')}]`,
        key,
        superKeys,
      );
    }

    return magistrate.ok(uuid);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      ...super.toDocument(),
      format: 'uuid',
    };
  }
}
