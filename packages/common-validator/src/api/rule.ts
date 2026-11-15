import { toArray, type Union2Intersection } from '@aomex/internal-tools';
import {
  AllOfValidator,
  AnyOfValidator,
  AnyValidator,
  ArrayValidator,
  BigIntValidator,
  BooleanValidator,
  BufferValidator,
  DateValidator,
  DecimalValidator,
  EmailValidator,
  EnumValidator,
  enumLikeToRanges,
  type EnumLike,
  type EnumLikeValues,
  HashValidator,
  IntValidator,
  IpValidator,
  LiteralValidator,
  NumberValidator,
  ObjectValidator,
  OneOfValidator,
  StreamValidator,
  StringValidator,
  UlidValidator,
  UrlValidator,
  UuidValidator,
  type LiteralValue,
} from '../validators';
import { Validator } from '../base';
import type { ValidatorSchema } from '../base/validator-schema';
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
  allOf<T extends ValidatorToken[], A extends ValidatorToken, B extends ValidatorToken>(
    rules: [rule1: A, rule2: B, ...others: T],
  ): AllOfValidator<
    Validator.Infer<A> &
      Validator.Infer<B> &
      Union2Intersection<{ [K in keyof T]: Validator.Infer<T[K]> }[number]>
  > {
    return new AllOfValidator(rules.map(toValidator) as [Validator, ...Validator[]]);
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
  anyOf<T extends ValidatorToken[], A extends ValidatorToken, B extends ValidatorToken>(
    rules: [rule1: A, rule2: B, ...others: T],
  ): AnyOfValidator<
    | Validator.Infer<A>
    | Validator.Infer<B>
    | { [K in keyof T]: Validator.Infer<T[K]> }[number]
  > {
    return new AnyOfValidator(rules.map(toValidator) as [Validator, ...Validator[]]);
  }

  array(): ArrayValidator<unknown[]>;
  array<T extends Validator>(item: T): ArrayValidator<Validator.Infer<T>[]>;
  array<T extends ValidatorSchema<any>>(item: T): ArrayValidator<Validator.Infer<T>[]>;
  /**
   * 对象验证规则的快捷操作，等价于 `rule.array(rule.object({...}))`；
   * 嵌套裸对象同样会转为 `rule.object`
   */
  array<T extends { [key: string]: ValidatorToken }>(
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
   * @deprecated 请使用 rule.date()
   */
  dateTime(...formats: string[]): DateValidator<Date> {
    return new DateValidator(formats);
  }

  /**
   * @param formats 设置解析字符串的格式，支持同时指定不同的格式并从左到右依次尝试。如果是标准的ISO时间格式或者时间戳则无需指定。
   *
   * @link https://moment.github.io/luxon/#/formatting?id=table-of-tokens
   */
  date(...formats: string[]): DateValidator<Date> {
    return new DateValidator(formats);
  }

  /**
   * 高精度小数（decimal.js）
   *
   * 注意：非严格模式下，`number` 和 `string` 会尝试被转换成 `Decimal` 类型
   */
  decimal() {
    return new DecimalValidator();
  }

  email() {
    return new EmailValidator();
  }

  /**
   * ```typescript
   * rule.enum(['a', 'b', 1]);
   * rule.enum(Color); // TS enum / 枚举对象
   * ```
   */
  enum<const T extends string | number | boolean>(ranges: T[]): EnumValidator<T>;
  enum<const T extends readonly (string | number | boolean)[]>(
    ranges: T,
  ): EnumValidator<T[number]>;
  enum<const T extends EnumLike>(enumeration: T): EnumValidator<EnumLikeValues<T>>;
  enum(rangesOrEnum: Array<string | number | boolean> | EnumLike) {
    if (Array.isArray(rangesOrEnum)) {
      return new EnumValidator(toArray(rangesOrEnum, true));
    }
    return new EnumValidator(enumLikeToRanges(rangesOrEnum));
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
   * 精确匹配单个字面量（不做类型转换）
   * ```typescript
   * rule.literal('ok');
   * rule.literal(1);
   * rule.literal(true);
   * rule.literal(null);
   * ```
   */
  literal<const T extends LiteralValue>(value: T): LiteralValidator<T> {
    return new LiteralValidator(value);
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
   * rule.object(userSchema);
   * ```
   */
  object(): ObjectValidator<Validator.TObject>;
  object<T extends ValidatorSchema<any>>(
    properties: T,
  ): ObjectValidator<Validator.Infer<T>>;
  /**
   * 字段表可嵌套裸对象，等价于内层再包一层 `rule.object`
   */
  object<T extends { [key: string]: ValidatorToken }>(
    properties: T,
  ): ObjectValidator<Validator.Infer<T>>;
  object(properties?: ValidatorToken): ObjectValidator<any> {
    if (!properties) return new ObjectValidator();
    return toValidator(properties) as ObjectValidator<any>;
  }

  /**
   * 动态键对象（`Record<string, V>`），等价于 `rule.object().additional({ value })`
   * ```typescript
   * rule.record(rule.number());
   * rule.record({ id: rule.int() });
   * ```
   */
  record<V extends ValidatorToken>(
    value: V,
  ): ObjectValidator<{ [K: string]: Validator.Infer<V> }> {
    return new ObjectValidator().additional({ value });
  }

  /**
   * 必须且只能匹配其中一个规则，如果匹配上多个则失败
   * ```typescript
   * rule.oneOf([rule.number(), rule.string()]);
   * ```
   */
  oneOf<T extends ValidatorToken[], A extends ValidatorToken, B extends ValidatorToken>(
    rules: [rule1: A, rule2: B, ...others: T],
  ): OneOfValidator<
    | Validator.Infer<A>
    | Validator.Infer<B>
    | { [K in keyof T]: Validator.Infer<T[K]> }[number]
  > {
    return new OneOfValidator(rules.map(toValidator) as [Validator, ...Validator[]]);
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
      UuidValidator.Version | [UuidValidator.Version, ...UuidValidator.Version[]],
  ) {
    return new UuidValidator(toArray(versions || UuidValidator.versions));
  }
}

export const rule = new Rule();
