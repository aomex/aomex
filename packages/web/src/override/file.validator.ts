import { PersistentFile, File as InternalFile } from 'formidable';
import mimeTypes from 'mime-types';
import {
  Validator,
  type TransformedValidator,
  magistrate,
  OpenAPI,
  Rule,
  i18n,
} from '@aomex/core';
import { bytes } from '@aomex/internal-tools';
import typeIs from 'type-is';

declare module '@aomex/core' {
  export interface Rule {
    file(): FileValidator;
  }
}

export declare namespace FileValidator {
  export interface Options<T> extends Validator.Options<T> {
    maxSize?: number;
    mimeTypes?: string[];
  }

  export interface FormidableFile extends InternalFile {
    hash: string;
    hashAlgorithm: 'md5';
  }
}

export class FileValidator<T = FileValidator.FormidableFile> extends Validator<T> {
  protected declare config: FileValidator.Options<T>;

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => FileValidator<T | Validator.TOptional>;
  public declare transform: <T1>(
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
   * 允许的媒体格式
   * ```typescript
   * file.mimeTypes('.html', '.png', 'image/*', 'text/plain');
   * ```
   */
  public mimeTypes(mineOrExt: string, ...others: string[]): this;
  public mimeTypes(mineOrExt: string[]): this;
  public mimeTypes(mineOrExt: string[] | string, ...others: string[]): FileValidator<T> {
    const validator = this.copy();
    validator.config.mimeTypes = <string[]>[
      ...new Set(
        ([] as string[])
          .concat(mineOrExt)
          .concat(others)
          .map(mimeTypes.contentType)
          .filter(Boolean),
      ),
    ];
    return validator;
  }

  protected override isEmpty(value: any): boolean {
    return super.isEmpty(value) || (Array.isArray(value) && !value.length);
  }

  protected validateValue(
    file: FileValidator.FormidableFile,
    _key: string,
    label: string,
  ): magistrate.Result<FileValidator.FormidableFile> {
    const { maxSize, mimeTypes } = this.config;

    if (Array.isArray(file)) {
      file = file[0];
    }

    if (!(file instanceof PersistentFile)) {
      return magistrate.fail(i18n.t('web.validator.file.must_be_file', { label }));
    }

    if (maxSize !== void 0 && file.size > maxSize) {
      return magistrate.fail(i18n.t('web.validator.file.too_large', { label }));
    }

    const hasMimeTypeLimitation = mimeTypes && mimeTypes.length;

    if (
      hasMimeTypeLimitation &&
      (!file.mimetype || !typeIs.is(file.mimetype, ...mimeTypes))
    ) {
      return magistrate.fail(
        i18n.t('web.validator.file.unsupported_mimetype', { label }),
      );
    }

    return magistrate.ok(file);
  }

  protected declare copy: () => FileValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      type: 'string',
      format: 'binary',
    };
  }
}

Rule.register('file', FileValidator);
