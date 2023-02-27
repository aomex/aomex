import { PersistentFile, File as InternalFile } from 'formidable';
import mimeTypes from 'mime-types';
import {
  ValidatorOptions,
  Validator,
  TransformedValidator,
  ValidateResult,
  magistrate,
  OpenAPI,
  Rule,
} from '@aomex/core';
import { bytes } from '@aomex/helper';

declare module '@aomex/core' {
  export interface Rule {
    file(): FileValidator;
  }
}

export interface FileValidatorOptions<T> extends ValidatorOptions<T> {
  maxSize?: number;
  mimeTypes?: string[];
}

export interface FormidableFile extends InternalFile {
  hash: 'string';
  hashAlgorithm: 'md5';
}

export class FileValidator<T = FormidableFile> extends Validator<T> {
  protected declare config: FileValidatorOptions<T>;

  public declare optional: () => FileValidator<T | Validator.TOptional>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  /**
   * Examples:
   * - 1024
   * - 2048
   * - '15KB'
   * - '20MB'
   */
  public maxSize(byte: number | string): this {
    this.config.maxSize = typeof byte === 'number' ? byte : bytes(byte);
    return this;
  }

  /**
   * ```typescript
   * file.mimeTypes('.html', '.png', 'image/*', 'text/plain');
   * ```
   */
  public mimeTypes(mineOrExt: string, ...others: string[]): this;
  public mimeTypes(mineOrExt: string[]): this;
  public mimeTypes(mineOrExt: string[] | string, ...others: string[]): this {
    this.config.mimeTypes = <string[]>[
      ...new Set(
        ([] as string[])
          .concat(mineOrExt)
          .concat(others)
          .map(mimeTypes.contentType)
          .filter(Boolean),
      ),
    ];
    return this;
  }

  protected override isEmpty(value: any): boolean {
    return super.isEmpty(value) || (Array.isArray(value) && !value.length);
  }

  protected validateValue(
    file: FormidableFile,
    key: string,
    superKeys: string[],
  ): ValidateResult<FormidableFile> {
    const { maxSize, mimeTypes } = this.config;

    if (Array.isArray(file)) {
      return magistrate.fail(
        'use array validator for multiple files',
        key,
        superKeys,
      );
    }

    if (!(file instanceof PersistentFile)) {
      return magistrate.fail('must be file', key, superKeys);
    }

    if (maxSize !== void 0 && file.size > maxSize) {
      return magistrate.fail('file size is too large', key, superKeys);
    }

    if (mimeTypes && (!file.mimetype || !mimeTypes.includes(file.mimetype))) {
      return magistrate.fail('file not match mime-types', key, superKeys);
    }

    return magistrate.ok(file);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      type: 'string',
      format: 'binary',
    };
  }
}

Rule.register('file', FileValidator);
