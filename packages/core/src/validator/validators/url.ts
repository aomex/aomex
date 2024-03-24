import type { OpenAPI } from '../../interface';
import {
  magistrate,
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
  protected declare config: UrlValidator.Options<T>;

  constructor() {
    super();
    this.config.allowedScheme = ['http', 'https'];
  }

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => UrlValidator<T | Validator.TOptional>;
  public declare nullable: () => UrlValidator<T | null>;
  public declare default: (
    Url: Validator.ParameterOrFn<T>,
  ) => UrlValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
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
    key: string,
    superKeys: string[],
  ): magistrate.Result<string> {
    const { allowedScheme } = this.config;

    if (!/^[a-z0-9]+:\/\//.test(url)) {
      return magistrate.fail('必须是URL格式', key, superKeys);
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return magistrate.fail('必须是URL格式', key, superKeys);
    }

    const scheme = parsedUrl.protocol.slice(0, -1);
    if (!allowedScheme.includes(scheme)) {
      return magistrate.fail('包含不支持的协议', key, superKeys);
    }

    return magistrate.ok(url);
  }

  protected declare copy: () => UrlValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      ...super.toDocument(),
      format: 'url',
    };
  }
}
