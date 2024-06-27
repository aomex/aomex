import ipRegexp, { type Options as IpRegexOptions } from 'ip-regex';
import type { OpenAPI } from '../../interface';
import {
  magistrate,
  type TransformedValidator,
  BaseStringValidator,
  Validator,
} from '../base';
import { i18n } from '../../i18n';

const versions = <const>['v4', 'v6'];

export declare namespace IpValidator {
  export type Version = (typeof versions)[number];

  export interface Options<T> extends BaseStringValidator.Options<T> {
    ipVersion: IpValidator.Version[];
  }
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

  protected declare config: IpValidator.Options<T>;

  constructor(version: IpValidator.Version[]) {
    super();
    this.config.ipVersion = [...new Set(version)];
  }

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => IpValidator<T | Validator.TOptional>;
  public declare nullable: () => IpValidator<T | null>;
  public declare default: (
    ip: Validator.ParameterOrFn<T>,
  ) => IpValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  public declare match: (pattern: RegExp) => this;

  protected validateString(
    ip: string,
    _key: string,
    label: string,
  ): magistrate.Result<string> {
    const { ipVersion } = this.config;

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
        i18n.t('core.validator.string.must_be_ip', {
          label,
          versions: ipVersion.toString(),
        }),
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
