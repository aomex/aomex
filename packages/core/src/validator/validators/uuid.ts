import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import {
  magistrate,
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

  protected declare config: UuidValidator.Options<T>;

  constructor(versions: UuidValidator.Version[]) {
    super();
    this.config.uuidVersion = [...new Set(versions)];
  }

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => UuidValidator<T | Validator.TOptional>;
  public declare nullable: () => UuidValidator<T | null>;

  public declare default: (
    uuid: Validator.ParameterOrFn<T>,
  ) => UuidValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  public declare match: (pattern: RegExp) => this;

  protected validateString(
    uuid: string,
    _key: string,
    label: string,
  ): magistrate.Result<string> {
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
      return magistrate.fail(
        i18n.t('core.validator.string.must_be_uuid', {
          label,
          versions: uuidVersion.join(','),
        }),
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
