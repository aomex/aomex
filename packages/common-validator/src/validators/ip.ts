import { isIP, isIPv4, isIPv6 } from 'node:net';
import type { OpenAPI } from '@aomex/internal-tools';
import {
  ValidateResult,
  type TransformedValidator,
  BaseStringValidator,
  Validator,
} from '../base';
import { i18n } from '../i18n';

export declare namespace IpValidator {
  export type Version = 'v4' | 'v6';

  export interface Options<T> extends BaseStringValidator.Options<T> {
    ipVersion: IpValidator.Version[];
  }
}

export class IpValidator<T = string> extends BaseStringValidator<T> {
  declare protected config: IpValidator.Options<T>;

  constructor(version: IpValidator.Version[]) {
    super();
    this.config.ipVersion = [...new Set(version)];
  }

  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => IpValidator<T | Validator.TOptional>;
  declare public nullable: () => IpValidator<T | null>;
  declare public default: (
    ip: Validator.ParameterOrFn<T>,
  ) => IpValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  declare public match: (pattern: RegExp) => this;

  protected validateString(
    ip: string,
    _key: string,
    label: string,
  ): ValidateResult.Any<string> {
    const { ipVersion } = this.config;

    let valid = false;
    const hasV4 = ipVersion.includes('v4');
    const hasV6 = ipVersion.includes('v6');
    if (hasV4 && hasV6) {
      valid = isIP(ip) > 0;
    } else if (hasV4) {
      valid = isIPv4(ip);
    } else {
      valid = isIPv6(ip);
    }

    if (!valid) {
      return ValidateResult.deny(
        i18n.t('validator.string.must_be_ip', {
          label,
          versions: ipVersion.toString(),
        }),
      );
    }

    return ValidateResult.accept(ip);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { ipVersion } = this.config;

    return {
      ...super.toDocument(),
      format: ipVersion.length === 1 ? `ip${ipVersion[0]}` : 'ip',
    };
  }
}
