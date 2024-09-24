import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import {
  magistrate,
  BaseStringValidator,
  type TransformedValidator,
  Validator,
} from '../base';

export declare namespace HashValidator {
  export type Algorithm = keyof (typeof HashValidator)['algorithmLength'];

  export interface Options<T> extends BaseStringValidator.Options<T> {
    algorithm: HashValidator.Algorithm;
  }
}

export class HashValidator<T = string> extends BaseStringValidator<T> {
  /**
   * @see https://github.com/validatorjs/validator.js
   */
  protected static algorithmLength = <const>{
    md5: 32,
    md4: 32,
    sha1: 40,
    sha256: 64,
    sha384: 96,
    sha512: 128,
    ripemd128: 32,
    ripemd160: 40,
    tiger128: 32,
    tiger160: 40,
    tiger192: 48,
    crc32: 8,
    crc32b: 8,
  };

  protected static algorithmPattern: Record<string, RegExp> = (() => {
    const patterns: Record<string, RegExp> = {};
    Object.values(HashValidator.algorithmLength).forEach((length) => {
      patterns[length] ||= new RegExp(`^[a-f0-9]{${length}}$`, 'i');
    });
    return patterns;
  })();

  protected declare config: HashValidator.Options<T>;

  constructor(algorithm: HashValidator.Algorithm) {
    super();
    this.config.algorithm = algorithm;

    if (!Object.hasOwn(HashValidator.algorithmLength, algorithm)) {
      throw new Error('未知的哈希类型');
    }
  }

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => HashValidator<T | Validator.TOptional>;
  public declare nullable: () => HashValidator<T | null>;
  public declare default: (
    algorithm: Validator.ParameterOrFn<T>,
  ) => HashValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected override validateString(
    hash: string,
    _key: string,
    label: string,
  ): magistrate.Result<string> {
    const { algorithm } = this.config;

    const length = HashValidator.algorithmLength[algorithm];
    if (!HashValidator.algorithmPattern[length]!.test(hash)) {
      return magistrate.fail(i18n.t('validator.string.must_be_hash', { label }));
    }

    return magistrate.ok(hash);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { algorithm } = this.config;
    const length = HashValidator.algorithmLength[algorithm];

    return {
      ...super.toDocument(),
      minLength: length,
      maxLength: length,
      format: this.config.algorithm,
    };
  }
}
