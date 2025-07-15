import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';
import { DateTime } from 'luxon';

export declare namespace DateValidator {
  export interface Options<T = Date> extends Validator.Options<T> {
    min?: () => Date;
    minInclusive?: boolean;
    max?: () => Date;
    maxInclusive?: boolean;
    parseFromTimestamp?: boolean;
    formats?: string[];
  }
}

const regTimestamp = /^[0-9.]+$/;
const regUnixTimeWithMS = /^[0-9]{10}\.[0-9]{3}$/;

export class DateValidator<T = Date> extends Validator<T> {
  declare protected config: DateValidator.Options<T>;

  constructor(formats?: string[]) {
    super();
    this.config.formats = formats;
  }

  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => DateValidator<T | Validator.TOptional>;
  declare public nullable: () => DateValidator<T | null>;
  declare public default: (
    date: Validator.ParameterOrFn<Date>,
  ) => DateValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  public min(freshDate: () => Date, inclusive: boolean = true): DateValidator<T> {
    const validator = this.copy();
    validator.config.min = freshDate;
    validator.config.minInclusive = inclusive;
    return validator;
  }

  public max(freshDate: () => Date, inclusive: boolean = true): DateValidator<T> {
    const validator = this.copy();
    validator.config.max = freshDate;
    validator.config.maxInclusive = inclusive;
    return validator;
  }

  /**
   * 尝试把时间戳数字解析成时间对象。默认已开启
   *
   * 支持如下格式：
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
  ): ValidateResult.Any<Date> {
    const date = this.toDate(value);
    if (date === false || date.toString() === 'Invalid Date') {
      return ValidateResult.deny(i18n.t('validator.date.must_be_date', { label }));
    }

    if (!this.compare(date)) {
      return ValidateResult.deny(i18n.t('validator.date.not_in_range', { label }));
    }

    return ValidateResult.accept(date);
  }

  protected toDate(value: any): false | Date {
    const { parseFromTimestamp = true, formats } = this.config;

    if (value instanceof Date) return value;

    if (
      parseFromTimestamp &&
      (typeof value === 'number' ||
        (typeof value === 'string' && regTimestamp.test(value)))
    ) {
      const timestamp = value.toString();
      // unix时间戳
      if (timestamp.length === 10)
        return DateTime.fromSeconds(Number(timestamp)).toJSDate();
      // 带毫秒的时间戳
      if (timestamp.length === 13)
        return DateTime.fromMillis(Number(timestamp)).toJSDate();
      // 带毫秒的unix时间戳
      if (timestamp.length === 14 && regUnixTimeWithMS.test(timestamp)) {
        return DateTime.fromSeconds(Number(timestamp)).toJSDate();
      }
    }

    if (typeof value === 'string') {
      if (formats && formats.length) {
        for (const format of formats) {
          const date = DateTime.fromFormat(value, format, { setZone: true });
          if (date.isValid) return date.toJSDate();
        }
      } else {
        return DateTime.fromISO(value).toJSDate();
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

  declare protected copy: () => this;

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
