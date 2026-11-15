import { PersistentFile, File as InternalFile } from 'formidable';
import { fileTypeFromFile } from 'file-type';
import mimeTypes from 'mime-types';
import {
  Validator,
  type TransformedValidator,
  ValidateResult,
  OpenAPI,
  Rule,
} from '@aomex/common';
import { bytes } from '@aomex/internal-tools';
import typeIs from 'type-is';
import { i18n } from '../i18n';

declare module '@aomex/common' {
  export interface Rule {
    file(): FileValidator;
  }
}

export declare namespace FileValidator {
  export interface Options<T> extends Validator.Options<T> {
    maxSize?: number;
    mimeTypes?: string[];
    /**
     * 认不出文件签名时，是否用客户端声明的 Content-Type 对照允许列表。
     * 默认值：`false`
     */
    fallbackToMimetype?: boolean;
  }

  export interface FormidableFile extends InternalFile {
    hash: string;
    hashAlgorithm: 'md5';
  }
}

export class FileValidator<T = FileValidator.FormidableFile> extends Validator<T> {
  declare protected config: FileValidator.Options<T>;

  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => FileValidator<T | Validator.TOptional>;
  declare public required: () => FileValidator<Exclude<T, Validator.TOptional>>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  /**
   * 允许的最大体积
   *
   * 可选格式：
   * - 1024
   * - 2048
   * - '15KB'
   * - '20MB'
   */
  public maxSize(byte: number | string): FileValidator<T> {
    const validator = this.copy();
    validator.config.maxSize = typeof byte === 'number' ? byte : bytes(byte);
    return validator;
  }

  /**
   * 允许的媒体格式。有文件签名时以文件内容为准。
   * 认不出文件签名时默认拒绝；纯文本、HTML、SVG 需要再调用 `fallbackToMimetype()`。
   * ```typescript
   * file.mimeTypes('.png', 'image/*');
   * file.mimeTypes('.html', 'text/plain').fallbackToMimetype();
   * ```
   */
  public mimeTypes(mineOrExt: string, ...others: string[]): this;
  public mimeTypes(mineOrExt: string[]): this;
  public mimeTypes(mineOrExt: string[] | string, ...others: string[]): FileValidator<T> {
    const tokens = ([] as string[]).concat(mineOrExt).concat(others);
    const validator = this.copy();
    validator.config.mimeTypes = [
      ...new Set(tokens.map((token) => this.resolveMimeType(token))),
    ];
    return validator;
  }

  /**
   * 认不出文件签名时，改用客户端声明的 Content-Type 对照 `mimeTypes()`。
   * 不调用则仍然拒绝。参数默认值：`true`。
   *
   * 没有稳定文件签名、允许时要打开：纯文本、CSV、Markdown、CSS、JSON、
   * JavaScript 源码、HTML，以及不以 `<?xml` 开头的 SVG。
   * 带 `<?xml` 的 XML 会被认成 `application/xml`，不必开；同样开头的 SVG
   * 也会被认成 XML，`image/svg+xml` 仍然对不上。
   */
  public fallbackToMimetype(enable = true): FileValidator<T> {
    const validator = this.copy();
    validator.config.fallbackToMimetype = enable;
    return validator;
  }

  protected override isEmpty(value: any): boolean {
    return super.isEmpty(value) || (Array.isArray(value) && !value.length);
  }

  protected async validateValue(
    file: FileValidator.FormidableFile,
    _key: string,
    label: string,
  ): Promise<ValidateResult.Any<FileValidator.FormidableFile>> {
    const { maxSize, mimeTypes, fallbackToMimetype } = this.config;

    if (Array.isArray(file)) file = file[0];

    if (!(file instanceof PersistentFile)) {
      return ValidateResult.deny(i18n.t('validator.file.must_be_file', { label }));
    }

    if (maxSize !== void 0 && file.size > maxSize) {
      return ValidateResult.deny(i18n.t('validator.file.too_large', { label }));
    }

    const detected = file.filepath ? await this.detectMimeType(file.filepath) : undefined;
    // 认出文件签名就覆盖。认不出时保留客户端声明的类型。
    if (detected) file.mimetype = detected;

    const hasMimeTypeLimitation = mimeTypes && mimeTypes.length;
    const actual = detected ?? (fallbackToMimetype ? file.mimetype : null);
    if (hasMimeTypeLimitation && (!actual || !typeIs.is(actual, ...mimeTypes))) {
      return ValidateResult.deny(
        i18n.t('validator.file.unsupported_mimetype', { label }),
      );
    }

    return ValidateResult.accept(file);
  }

  /** 读取文件头中的文件签名。认不出时返回 `undefined`。 */
  protected async detectMimeType(filepath: string): Promise<string | undefined> {
    const detected = await fileTypeFromFile(filepath);
    return detected?.mime;
  }

  /**
   * 把扩展名查成媒体类型；已是 `type/subtype`（subtype 可为 `*`）则原样返回。
   * 无法识别时抛错，避免允许列表被悄悄清空。
   */
  protected resolveMimeType(token: string): string {
    if (token.includes('/')) {
      if (/^[\w!#$&^.+-]+\/(\*|[\w!#$&^.+-]+)$/i.test(token)) {
        return token;
      }
      throw new Error(i18n.t('validator.file.invalid_mimetype_token', { token }));
    }

    const resolved = mimeTypes.lookup(token);
    if (!resolved) {
      throw new Error(i18n.t('validator.file.invalid_mimetype_token', { token }));
    }
    return resolved;
  }

  declare protected copy: () => FileValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      type: 'string',
      format: 'binary',
    };
  }
}

Rule.register('file', FileValidator);
