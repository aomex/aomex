import type { OpenAPI } from '../../interface';
import { magistrate, type TransformedValidator, Validator } from '../base';

export declare namespace BufferValidator {
  export interface Options<T = Buffer> extends Validator.Options<T> {
    fromEncodings?: Encodings[];
  }

  export type Encodings = 'hex';
}

const hexReg = /^(?:0x)?[0-9a-f]+$/i;

export class BufferValidator<T = Buffer> extends Validator<T> {
  protected declare config: BufferValidator.Options<T>;

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => BufferValidator<T | Validator.TOptional>;
  public declare nullable: () => BufferValidator<T | null>;
  public declare default: (
    buffer: Buffer,
  ) => BufferValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  /**
   * 尝试从其他类型恢复为buffer类型：
   *
   * - `hex` 从十六进制字符串恢复
   */
  parseFrom(...encodings: BufferValidator.Encodings[]): this {
    const validator = this.copy();
    validator.config.fromEncodings = [...new Set(encodings)];
    return validator;
  }

  protected validateValue(
    value: any,
    key: string,
    superKeys: string[],
  ): magistrate.Result<Buffer> {
    const { fromEncodings = [] } = this.config;
    let buffer: Buffer | undefined;

    if (!Buffer.isBuffer(value)) {
      loop: for (const encoding of fromEncodings) {
        switch (encoding) {
          case 'hex':
            if (typeof value === 'string' && hexReg.test(value)) {
              try {
                buffer = Buffer.from(value.replace(/^0x/i, ''), 'hex');
                break loop;
              } catch {}
            }
            break;
        }
      }
    } else {
      buffer = value;
    }

    if (!buffer) {
      return magistrate.fail('必须是缓冲区类型', key, superKeys);
    }

    return magistrate.ok(buffer);
  }

  protected declare copy: () => this;

  protected override toDocument(): OpenAPI.SchemaObject {
    const defaultValue: Buffer | undefined = this.getDefaultValue(
      this.config.defaultValue,
    );

    return {
      type: 'string',
      format: 'byte',
      // JSON 无法处理buffer类型
      default: defaultValue && defaultValue.toString('hex'),
    };
  }
}
