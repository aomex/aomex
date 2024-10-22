import { toArray, type Union2Intersection } from '@aomex/internal-tools';
import {
  AllOfValidator,
  AnyOfValidator,
  AnyValidator,
  ArrayValidator,
  BigIntValidator,
  BooleanValidator,
  BufferValidator,
  DateTimeValidator,
  EmailValidator,
  EnumValidator,
  HashValidator,
  IntValidator,
  IpValidator,
  NumberValidator,
  ObjectValidator,
  OneOfValidator,
  StreamValidator,
  StringValidator,
  UlidValidator,
  UrlValidator,
  UuidValidator,
} from '../validators';
import { Validator } from '../base';
import { type ValidatorToken, toValidator } from './to-validator';

export class Rule {
  static register<T extends Rule, K extends keyof T>(
    this: new (...args: any[]) => T,
    name: K,
    SubValidator: new (...args: any[]) => Validator,
  ) {
    this.prototype[name] = () => new SubValidator();
  }

  /**
   * 规则以管道形式执行，需要匹配所有规则
   * ```typescript
   * rule.allOf([rule.number(), rule.string()]);
   * ```
   */
  allOf<T extends Validator[], A extends Validator, B extends Validator>(
    rules: [rule1: A, rule2: B, ...others: T],
  ): AllOfValidator<
    Validator.Infer<A> &
      Validator.Infer<B> &
      Union2Intersection<{ [K in keyof T]: Validator.Infer<T[K]> }[number]>
  > {
    return new AllOfValidator(rules);
  }
  /**
   * 允许任何类型：
   * - string
   * - number
   * - boolean
   * - array
   * - object
   * - buffer
   */
  any() {
    return new AnyValidator();
  }

  /**
   * 规则以管道形式执行，需要至少匹配一个规则
   * ```typescript
   * rule.anyOf([rule.number(), rule.string()]);
   * ```
   */
  anyOf<T extends Validator[], A extends Validator, B extends Validator>(
    rules: [rule1: A, rule2: B, ...others: T],
  ): AnyOfValidator<
    | Validator.Infer<A>
    | Validator.Infer<B>
    | { [K in keyof T]: Validator.Infer<T[K]> }[number]
  > {
    return new AnyOfValidator(rules);
  }

  array(): ArrayValidator<unknown[]>;
  array<T extends Validator>(item: T): ArrayValidator<Validator.Infer<T>[]>;
  /**
   * 对象验证规则的快捷操作，等价于 `rule.array(rule.object({}))`
   */
  array<T extends { [key: string]: P }, P extends Validator>(
    ruleObject: T,
  ): ArrayValidator<Validator.Infer<T>[]>;
  array(values?: ValidatorToken) {
    return new ArrayValidator<any>(toValidator(values));
  }

  /**
   * 大整数类型
   *
   * 注意：非严格模式下，`number` 和 `string` 会尝试被转换成 `bigint` 类型
   */
  bigint() {
    return new BigIntValidator();
  }

  /**
   * - 默认真值：`[1, '1', true, 'true']`
   * - 默认假值：`[0, '0', false, 'false']`
   */
  boolean() {
    return new BooleanValidator();
  }

  buffer<T extends Buffer>() {
    return new BufferValidator<T>();
  }

  /**
   * @param formats 设置解析字符串的格式，支持同时指定不同的格式并从左到右依次尝试。如果是标准的ISO时间格式或者时间戳则无需指定。
   *
   * @link https://moment.github.io/luxon/#/formatting?id=table-of-tokens
   */
  dateTime(...formats: string[]): DateTimeValidator<Date> {
    return new DateTimeValidator(formats);
  }

  email() {
    return new EmailValidator();
  }

  enum<const T extends string | number | boolean>(ranges: T[]): EnumValidator<T>;
  enum<const T extends readonly (string | number | boolean)[]>(
    ranges: T,
  ): EnumValidator<T[number]>;
  enum(ranges: any[]) {
    return new EnumValidator(toArray(ranges, true));
  }

  hash(algorithm: HashValidator.Algorithm) {
    return new HashValidator(algorithm);
  }

  /**
   * 注意：非严格模式下，`string` 会尝试被转换成 `number` 类型
   */
  int() {
    return new IntValidator();
  }

  /**
   * ```typescript
   * rule.ip('v4');
   * rule.ip('v6');
   * rule.ip(['v4', 'v6']);
   * ```
   */
  ip(version: IpValidator.Version | [IpValidator.Version, ...IpValidator.Version[]]) {
    return new IpValidator(toArray(version));
  }

  /**
   * 注意：非严格模式下，`string` 会尝试被转换成 `number` 类型
   */
  number() {
    return new NumberValidator();
  }

  /**
   * ```typescript
   * rule.object();
   * rule.object({
   *   id: rule.int(),
   *   profile: rule.object({
   *     sex: rule.enum(['unknown', 'male', 'female']),
   *   }),
   * });
   * ```
   */
  object<T extends { [key: string]: Validator } | undefined>(
    properties?: T,
  ): ObjectValidator<keyof T extends undefined ? Validator.TObject : Validator.Infer<T>> {
    return new ObjectValidator(properties);
  }

  /**
   * 必须且只能匹配其中一个规则，如果匹配上多个则失败
   * ```typescript
   * rule.oneOf([rule.number(), rule.string()]);
   * ```
   */
  oneOf<T extends Validator[], A extends Validator, B extends Validator>(
    rules: [rule1: A, rule2: B, ...others: T],
  ): OneOfValidator<
    | Validator.Infer<A>
    | Validator.Infer<B>
    | { [K in keyof T]: Validator.Infer<T[K]> }[number]
  > {
    return new OneOfValidator(rules);
  }

  /**
   * 数据流
   */
  stream() {
    return new StreamValidator();
  }

  string() {
    return new StringValidator();
  }

  ulid(): UlidValidator<string> {
    return new UlidValidator();
  }

  url(): UrlValidator<string> {
    return new UrlValidator();
  }

  /**
   * ```typescript
   * rule.uuid('v4');
   * rule.uuid(['v4', 'v5', 'v6']);
   * ```
   */
  uuid(): UuidValidator<string>;
  uuid(version: UuidValidator.Version): UuidValidator<string>;
  uuid(
    versions: [UuidValidator.Version, ...UuidValidator.Version[]],
  ): UuidValidator<string>;
  uuid(
    versions?:
      | UuidValidator.Version
      | [UuidValidator.Version, ...UuidValidator.Version[]],
  ) {
    return new UuidValidator(toArray(versions || UuidValidator.versions));
  }
}

export const rule = new Rule();
