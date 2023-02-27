import { toArray } from '@aomex/helper';
import {
  AnyValidator,
  ArrayValidator,
  BigIntValidator,
  BooleanValidator,
  BufferValidator,
  EmailValidator,
  EnumValidator,
  HashValidator,
  IntValidator,
  IpValidator,
  NumberValidator,
  ObjectValidator,
  OneOfValidator,
  StringValidator,
  UuidValidator,
} from '../validators';
import { Validator } from '../base';

export class Rule {
  static register<T extends Rule, K extends keyof T>(
    this: new (...args: any[]) => T,
    name: K,
    SubValidator: new (...args: any[]) => Validator,
  ) {
    this.constructor.prototype[name] = () => new SubValidator();
  }

  any() {
    return new AnyValidator();
  }

  /**
   * Input rule of every item
   */
  array<T extends Validator | undefined>(
    item?: T,
  ): ArrayValidator<
    keyof T extends undefined ? unknown[] : Validator.Infer<T>[]
  >;
  /**
   * Input short of object rule. equivalent to `rule.object({})`
   */
  array<T extends { [key: string]: P }, P extends Validator>(
    ruleObject: T,
  ): ArrayValidator<{ [K in keyof T]: Validator.Infer<T[K]> }[]>;
  array(values?: Validator | { [key: string]: Validator }) {
    return new ArrayValidator<any>(
      !values || values instanceof Validator ? values : this.object(values),
    );
  }

  /**
   * Notice: `number` or `string` will try to convert to `bigint`
   */
  bigint() {
    return new BigIntValidator();
  }

  /**
   * - Default true values: `[1, '1', true, 'true']`
   * - Default false values: `[0, '0', false, 'false']`
   *
   * ```typescript
   * rule.boolean();
   * rule.boolean().trueValues([true, 'yes']).falseValues([false, 'no']);
   * ```
   */
  boolean() {
    return new BooleanValidator();
  }

  buffer<T extends Buffer>() {
    return new BufferValidator<T>();
  }

  email() {
    return new EmailValidator();
  }

  enum<T extends string | number | boolean>(ranges: [T]): EnumValidator<T>;
  enum<
    T extends string | number | boolean,
    T1 extends string | number | boolean,
  >(ranges: [T, ...T1[]]): EnumValidator<T | T1>;
  enum<
    T extends string | number | boolean,
    T1 extends string | number | boolean,
  >(ranges: [T, ...T1[]]) {
    return new EnumValidator<T | T1>(ranges);
  }

  hash(algorithm: HashValidator.Algorithm) {
    return new HashValidator(algorithm);
  }

  /**
   * `string` will try to convert to `number`
   *
   * @see number()
   * @see bigint()
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
  ip(
    version:
      | IpValidator.Version
      | [IpValidator.Version, ...IpValidator.Version[]],
  ) {
    return new IpValidator(toArray(version, true));
  }

  /**
   * `string` will try to convert to `number`
   *
   * @see int()
   * @see bigint()
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
   *     sex: rule.enum(['unknow', 'male', 'female']),
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

  string() {
    return new StringValidator();
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
    versions:
      | UuidValidator.Version
      | [UuidValidator.Version, ...UuidValidator.Version[]],
  ) {
    return new UuidValidator(toArray(versions, true));
  }
}

export const rule = new Rule();
