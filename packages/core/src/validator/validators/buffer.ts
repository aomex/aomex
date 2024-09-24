import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import { magistrate, type TransformedValidator, Validator } from '../base';

export declare namespace BufferValidator {
  export interface Options<T = Buffer> extends Validator.Options<T> {
    fromEncodings?: Encodings[];
  }

  export type Encodings = 'base64' | 'hex';
}

const hexReg = /^(?:0x)?[0-9a-f]+$/i;
const base64Reg = /^([a-z0-9+/]{4})*([a-z0-9+/]{3}=|[a-z0-9+/]{2}==)?$/i;

export class BufferValidator<T = Buffer> extends Validator<T> {
  protected declare config: BufferValidator.Options<T>;

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => BufferValidator<T | Validator.TOptional>;
  public declare nullable: () => BufferValidator<T | null>;
  public declare default: (buffer: Buffer) => BufferValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  /**
   * 尝试从其他类型恢复为buffer类型：
   *
   * - `hex` 从十六进制字符串恢复
   * - `base64` 从base64字符串恢复
   */
  parseFrom(...encodings: BufferValidator.Encodings[]): this {
    const validator = this.copy();
    validator.config.fromEncodings = [...new Set(encodings)];
    return validator;
  }

  protected validateValue(
    value: any,
    _key: string,
    label: string,
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
          case 'base64':
            if (typeof value === 'string' && base64Reg.test(value)) {
              try {
                buffer = Buffer.from(value, 'base64');
                break loop;
              } catch {}
            }
        }
      }
    } else {
      buffer = value;
    }

    if (!buffer) {
      return magistrate.fail(i18n.t('validator.buffer.must_be_buffer', { label }));
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
      default: defaultValue && defaultValue.toString('base64'),
    };
  }
}
