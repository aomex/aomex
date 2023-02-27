import ipRegexp, { Options as IpRegexOptions } from 'ip-regex';
import type { OpenAPI } from '@aomex/openapi-type';
import {
  magistrate,
  TransformedValidator,
  BaseStringValidatorOptions,
  BaseStringValidator,
  ValidateResult,
  Validator,
} from '../base';

const versions = <const>['v4', 'v6'];

export declare namespace IpValidator {
  export type Version = (typeof versions)[number];
}

interface IpValidatorOptions<T> extends BaseStringValidatorOptions<T> {
  ipVersion: IpValidator.Version[];
}

const options: IpRegexOptions = { exact: true, includeBoundaries: true };

export class IpValidator<T = string> extends BaseStringValidator<T> {
  public static patterns: {
    [key in IpValidator.Version | 'all']: RegExp;
  } = {
    v4: ipRegexp.v4(options),
    v6: ipRegexp.v6(options),
    all: ipRegexp(options),
  };

  protected declare config: IpValidatorOptions<T>;

  constructor(version: IpValidator.Version[]) {
    super();
    this.config.ipVersion = version;
  }

  public declare optional: () => IpValidator<T | Validator.TOptional>;

  public declare default: (
    ip: Validator.ParameterOrFn<T>,
  ) => IpValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  public declare match: (pattern: RegExp) => this;

  protected validateValue(
    ip: string,
    key: string,
    superKeys: string[],
  ): ValidateResult<string> {
    const { ipVersion } = this.config;
    let checker: ValidateResult<string> | void;

    checker = this.shouldBeString(ip, key, superKeys);
    if (checker) return checker;

    ip = this.getTrimValue(ip);

    checker = this.shouldMatchPattern(ip, key, superKeys);
    if (checker) return checker;

    let valid = false;
    if (ipVersion.length === versions.length) {
      valid = IpValidator.patterns.all.test(ip);
    } else {
      for (let i = ipVersion.length; i-- > 0; ) {
        if (IpValidator.patterns[ipVersion[i]!].test(ip)) {
          valid = true;
          break;
        }
      }
    }

    if (!valid) {
      return magistrate.fail(
        `must be IP${
          ipVersion.length === 1 ? ipVersion : `[${ipVersion.join(',')}]`
        } address`,
        key,
        superKeys,
      );
    }

    return magistrate.ok(ip);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { ipVersion } = this.config;

    return {
      ...super.toDocument(),
      format: ipVersion.length === 1 ? `ip${ipVersion[0]}` : 'ip',
    };
  }
}
