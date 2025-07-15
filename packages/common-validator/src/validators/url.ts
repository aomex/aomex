import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import {
  ValidateResult,
  type TransformedValidator,
  BaseStringValidator,
  Validator,
} from '../base';
import { URL } from 'node:url';

export declare namespace UrlValidator {
  export interface Options<T> extends BaseStringValidator.Options<T> {
    allowedScheme: string[];
  }
}

export class UrlValidator<T = string> extends BaseStringValidator<T> {
  declare protected config: UrlValidator.Options<T>;

  constructor() {
    super();
    this.config.allowedScheme = ['http', 'https'];
  }

  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => UrlValidator<T | Validator.TOptional>;
  declare public nullable: () => UrlValidator<T | null>;
  declare public default: (
    Url: Validator.ParameterOrFn<T>,
  ) => UrlValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  /**
   * 允许使用的协议，不区分大小写。默认配置：`['http', 'https']`
   */
  public scheme(scheme: string[]): UrlValidator<T> {
    const validator = this.copy();
    validator.config.allowedScheme = scheme.map((item) => item.toLowerCase());
    return validator;
  }

  protected validateString(
    url: string,
    _key: string,
    label: string,
  ): ValidateResult.Any<string> {
    const { allowedScheme } = this.config;

    // http:/example.com 这种单斜杆的格式URL也能解析，因此需要使用正则先过滤
    if (!/^[a-z0-9]+:\/\/.+/.test(url) || !URL.canParse(url)) {
      return ValidateResult.deny(i18n.t('validator.url.must_be_url', { label }));
    }

    const parsedUrl = new URL(url);
    const scheme = parsedUrl.protocol.slice(0, -1);
    if (!allowedScheme.includes(scheme)) {
      return ValidateResult.deny(
        i18n.t('validator.url.unsupported_scheme', { label, scheme }),
      );
    }

    return ValidateResult.accept(url);
  }

  declare protected copy: () => UrlValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      example: 'https://example.com/path/to?id=1',
      ...super.toDocument(),
      format: 'uri',
    };
  }
}
