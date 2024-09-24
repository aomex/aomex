import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import { magistrate, type TransformedValidator, Validator } from '../base';

export declare namespace DateTimeValidator {
  export interface Options<T = Date> extends Validator.Options<T> {
    min?: () => Date;
    minInclusive?: boolean;
    max?: () => Date;
    maxInclusive?: boolean;
    parseFromTimestamp?: boolean;
  }
}

const unixTimeWithMS = /^[0-9]{10}\.[0-9]{3}$/;

export class DateTimeValidator<T = Date> extends Validator<T> {
  protected declare config: DateTimeValidator.Options<T>;

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => DateTimeValidator<T | Validator.TOptional>;
  public declare nullable: () => DateTimeValidator<T | null>;
  public declare default: (
    date: Validator.ParameterOrFn<Date>,
  ) => DateTimeValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  public min(freshDate: () => Date, inclusive: boolean = true): DateTimeValidator<T> {
    const validator = this.copy();
    validator.config.min = freshDate;
    validator.config.minInclusive = inclusive;
    return validator;
  }

  public max(freshDate: () => Date, inclusive: boolean = true): DateTimeValidator<T> {
    const validator = this.copy();
    validator.config.max = freshDate;
    validator.config.maxInclusive = inclusive;
    return validator;
  }

  /**
   * 尝试把时间戳数字解析成时间对象。支持如下格式：
   * - 13位：1711257956199
   * - 14位：1711257956.199
   * - 10位：1711257956
   */
  parseFromTimestamp(is: boolean = true) {
    const validator = this.copy();
    validator.config.parseFromTimestamp = is;
    return validator;
  }

  protected validateValue(
    value: any,
    _key: string,
    label: string,
  ): magistrate.Result<Date> {
    const date = this.toDate(value);
    if (date === false || date.toString() === 'Invalid Date') {
      return magistrate.fail(i18n.t('validator.dateTime.must_be_date', { label }));
    }

    if (!this.compare(date)) {
      return magistrate.fail(i18n.t('validator.dateTime.not_in_range', { label }));
    }

    return magistrate.ok(date);
  }

  protected toDate(value: any): false | Date {
    const { parseFromTimestamp } = this.config;

    if (value instanceof Date) return value;
    if (typeof value === 'string') return new Date(value);
    if (parseFromTimestamp && typeof value === 'number') {
      const timestamp = value.toString();
      // unix时间戳
      if (timestamp.length === 10) return new Date(Number(value + '000'));
      // 带毫秒的时间戳
      if (timestamp.length === 13) return new Date(value);
      // 带毫秒的unix时间戳
      if (timestamp.length === 14 && unixTimeWithMS.test(timestamp)) {
        return new Date(Number(timestamp.replace('.', '')));
      }
    }

    return false;
  }

  protected compare(date: Date) {
    const { min, minInclusive, max, maxInclusive } = this.config;
    const timestamp = +date;
    if (min !== undefined && (minInclusive ? timestamp < +min() : timestamp <= +min())) {
      return false;
    }
    if (max !== undefined && (maxInclusive ? timestamp > +max() : timestamp >= +max())) {
      return false;
    }
    return true;
  }

  protected declare copy: () => this;

  protected override toDocument(): OpenAPI.SchemaObject {
    const defaultValue: Date | undefined = this.getDefaultValue(this.config.defaultValue);
    // TODO: 最小最大时间
    return {
      type: 'string',
      format: 'date-time',
      default: defaultValue?.toISOString(),
    };
  }
}
