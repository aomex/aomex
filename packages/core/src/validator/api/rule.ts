import { toArray } from '@aomex/internal-tools';
import {
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

  array(): ArrayValidator<unknown[]>;
  array<T extends Validator>(item: T): ArrayValidator<Validator.Infer<T>[]>;
  /**
   * 对象验证规则的快捷操作，等价于 `rule.array(rule.object({}))`
   */
  array<T extends { [key: string]: P }, P extends Validator>(
    ruleObject: T,
  ): ArrayValidator<{ [K in keyof T]: Validator.Infer<T[K]> }[]>;
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

  dateTime() {
    return new DateTimeValidator();
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
  ): ObjectValidator<
    keyof T extends undefined
      ? Validator.TObject
      : { [K in keyof T]: Validator.Infer<T[K]> }
  > {
    return new ObjectValidator(properties);
  }

  /**
   * 匹配其中一个验证器
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
  uuid(version: UuidValidator.Version): UuidValidator<string>;
  uuid(
    versions: [UuidValidator.Version, ...UuidValidator.Version[]],
  ): UuidValidator<string>;
  uuid(
    versions: UuidValidator.Version | [UuidValidator.Version, ...UuidValidator.Version[]],
  ) {
    return new UuidValidator(toArray(versions));
  }
}

export const rule = new Rule();
