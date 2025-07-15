import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import {
  ValidateResult,
  type TransformedValidator,
  BaseStringValidator,
  Validator,
} from '../base';

export declare namespace UuidValidator {
  export type Version = (typeof UuidValidator.versions)[number];

  export interface Options<T = string> extends BaseStringValidator.Options<T> {
    uuidVersion: Version[];
  }
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
  public static versions = <const>['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8'];

  public static patterns: {
    [key in UuidValidator.Version | 'all']: RegExp;
  } = {
    v1: createRegexp(1),
    v2: createRegexp(2),
    v3: createRegexp(3),
    v4: createRegexp(4),
    v5: createRegexp(5),
    v6: createRegexp(6),
    v7: createRegexp(7),
    v8: createRegexp(8),
    all: createRegexp('all'),
  };

  declare protected config: UuidValidator.Options<T>;

  constructor(versions: UuidValidator.Version[]) {
    super();
    this.config.uuidVersion = [...new Set(versions)];
  }

  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => UuidValidator<T | Validator.TOptional>;
  declare public nullable: () => UuidValidator<T | null>;

  declare public default: (
    uuid: Validator.ParameterOrFn<T>,
  ) => UuidValidator<T | Validator.TDefault>;

  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  declare public match: (pattern: RegExp) => this;

  protected validateString(
    uuid: string,
    _key: string,
    label: string,
  ): ValidateResult.Any<string> {
    const { uuidVersion } = this.config;

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
      return ValidateResult.deny(
        i18n.t('validator.string.must_be_uuid', {
          label,
          versions: uuidVersion.join(','),
        }),
      );
    }

    return ValidateResult.accept(uuid);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      ...super.toDocument(),
      format: 'uuid',
    };
  }
}
