import type { OpenAPI } from '@aomex/openapi-type';
import {
  magistrate,
  BaseStringValidatorOptions,
  BaseStringValidator,
  TransformedValidator,
  ValidateResult,
  Validator,
} from '../base';

export declare namespace HashValidator {
  export type Algorithm = keyof typeof HashValidator.algorithmLength;
}

interface HashValidatorOptions<T> extends BaseStringValidatorOptions<T> {
  algorithm: HashValidator.Algorithm;
}

export class HashValidator<T = string> extends BaseStringValidator<T> {
  /**
   * @see https://github.com/validatorjs/validator.js
   */
  public static algorithmLength = <const>{
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

  public static algorithmPattern: Record<string, RegExp> = (() => {
    const patterns: Record<string, RegExp> = {};
    Object.values(HashValidator.algorithmLength).forEach((length) => {
      patterns[length] ||= new RegExp(`^[a-f0-9]{${length}}$`, 'i');
    });
    return patterns;
  })();

  protected declare config: HashValidatorOptions<T>;

  constructor(algorithm: HashValidator.Algorithm) {
    super();
    this.config.algorithm = algorithm;
  }

  public declare optional: () => HashValidator<T | Validator.TOptional>;

  public declare default: (
    algorithm: Validator.ParameterOrFn<T>,
  ) => HashValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected validateValue(
    hash: string,
    key: string,
    superKeys: string[],
  ): ValidateResult<string> {
    const { algorithm } = this.config;
    let checker: ValidateResult<string> | void;

    checker = this.shouldBeString(hash, key, superKeys);
    if (checker) return checker;

    hash = this.getTrimValue(hash);

    if (!Object.hasOwn(HashValidator.algorithmLength, algorithm)) {
      return magistrate.fail(`unknown hash: ${algorithm}`, key, superKeys);
    }

    if (
      !HashValidator.algorithmPattern[
        HashValidator.algorithmLength[algorithm]
      ]!.test(hash)
    ) {
      return magistrate.fail(`must be ${algorithm} hash`, key, superKeys);
    }

    return magistrate.ok(hash);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      ...super.toDocument(),
      format: this.config.algorithm,
    };
  }
}
