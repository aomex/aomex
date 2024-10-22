import assert from 'assert';
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
  StringValidator,
  UlidValidator,
  UrlValidator,
  UuidValidator,
  Validator,
  rule,
} from '../../../src';
import { expectType, type TypeEqual } from 'ts-expect';

// any
{
  const v = rule.any();
  expectType<AnyValidator<AnyValidator.Type>>(v);
  type Infer = Validator.Infer<typeof v>;
  expectType<
    TypeEqual<
      Infer,
      number | string | boolean | any[] | { [K: string]: unknown } | bigint | Buffer
    >
  >(true);
}

// allof
{
  expectType<AllOfValidator<{ foo: string } & { bar: number }>>(
    rule.allOf([
      rule.object({ foo: rule.string() }),
      rule.object({ bar: rule.number() }),
    ]),
  );

  expectType<AllOfValidator<{ foo: string } & { bar: number | null }>>(
    rule.allOf([
      rule.object({ foo: rule.string() }),
      rule.object({ bar: rule.number().nullable() }),
    ]),
  );

  expectType<AllOfValidator<{ foo: string } & { bar: number }>>(
    rule.allOf([
      rule.object({ foo: rule.string() }),
      rule.object({ bar: rule.number() }).nullable(),
    ]),
  );

  expectType<AllOfValidator<({ foo: string } & { bar: number }) | null>>(
    rule.allOf([
      rule.object({ foo: rule.string() }).nullable(),
      rule.object({ bar: rule.number() }).nullable(),
    ]),
  );
}

// anyof
{
  expectType<AnyOfValidator<{ foo: string } | { bar: number }>>(
    rule.anyOf([
      rule.object({ foo: rule.string() }),
      rule.object({ bar: rule.number() }),
    ]),
  );

  expectType<AnyOfValidator<{ foo: string } | { bar: number } | null>>(
    rule.anyOf([
      rule.object({ foo: rule.string() }),
      rule.object({ bar: rule.number() }).nullable(),
    ]),
  );
}

// array
{
  expectType<ArrayValidator<unknown[]>>(rule.array());
  expectType<ArrayValidator<string[][]>>(rule.array(rule.array(rule.string())));
  expectType<ArrayValidator<(string | undefined)[]>>(
    rule.array(rule.string().optional()),
  );
  expectType<ArrayValidator<string[]>>(
    // @ts-expect-error
    rule.array(rule.string().optional()),
  );

  {
    const v = rule.array({
      foo: rule.string(),
      bar: rule.string().optional(),
    });
    expectType<ArrayValidator<{ foo: string; bar?: string | undefined }[]>>(v);
    // @ts-expect-error
    expectType<ArrayValidator<{ foo: string; bar: string | undefined }[]>>(v);
    const foo: Validator.Infer<typeof v> = [
      { foo: '' },
      { foo: '', bar: '' },
      // @ts-expect-error
      { bar: '' },
    ];
    assert(foo);
  }
}

// bigint
{
  expectType<BigIntValidator<bigint>>(rule.bigint());
}

// boolean
{
  expectType<BooleanValidator<boolean>>(rule.boolean());
}

// buffer
{
  expectType<BufferValidator<Buffer>>(rule.buffer());
}

// dateTime
{
  rule.dateTime('yy-mm-dd');
  rule.dateTime('abc', 'yyy-mm-dd');
  expectType<DateTimeValidator<Date>>(rule.dateTime());
  // @ts-expect-error
  expectType<DateTimeValidator<object>>(rule.dateTime());
}

// email
{
  expectType<EmailValidator<string>>(rule.email());
}

// enum
{
  expectType<EnumValidator<'a' | 'b' | 1>>(rule.enum(['a', 'b', 1]));
  expectType<EnumValidator<'a' | 'b' | 'c'>>(rule.enum(['a', 'b', 'c']));
  expectType<EnumValidator<1 | 2 | 3>>(rule.enum([1, 2, 3]));
  // @ts-expect-error
  expectType<EnumValidator<string>>(rule.enum(['a', 'b', 'c']));
}

// hash
{
  expectType<HashValidator<string>>(rule.hash('md5'));
  rule.hash('sha1');
  rule.hash('sha256');
  // @ts-expect-error
  rule.hash('xx');
}

// int
{
  expectType<IntValidator<number>>(rule.int());
}

// ip
{
  expectType<IpValidator<string>>(rule.ip('v4'));
  rule.ip('v4');
  rule.ip('v6');
  rule.ip(['v4', 'v6']);
  // @ts-expect-error
  rule.ip('v4', 'v6');
  // @ts-expect-error
  rule.ip('v5');
}

// number
{
  expectType<NumberValidator<number>>(rule.number());
}

// object
{
  // @ts-expect-error
  expectType<ObjectValidator<object>>(rule.object());
  expectType<ObjectValidator<Validator.TObject>>(rule.object());
  {
    const v = rule.object({ test: rule.string() });
    expectType<ObjectValidator<{ test: string }>>(v);
    // @ts-expect-error
    expectType<ObjectValidator<{ test?: string }>>(v);
  }
  {
    const v = rule.object({ test: rule.string().optional(), test1: rule.number() });
    expectType<ObjectValidator<{ test?: string | undefined; test1: number }>>(v);
    // @ts-expect-error
    expectType<ObjectValidator<{ test: string; test1: number }>>(v);
    // @ts-expect-error
    expectType<ObjectValidator<{ test: string | undefined; test1: number }>>(v);
  }
}

// oneOf
{
  expectType<OneOfValidator<number | string>>(rule.oneOf([rule.string(), rule.number()]));
  expectType<OneOfValidator<number | string | undefined>>(
    rule.oneOf([rule.string(), rule.number().optional()]),
  );
  expectType<OneOfValidator<string>>(rule.oneOf([rule.string(), rule.string()]));
  expectType<OneOfValidator<string>>(
    // @ts-expect-error
    rule.oneOf([rule.string(), rule.number()]),
  );
}

// string
{
  expectType<StringValidator<string>>(rule.string());
}

// ulid
{
  expectType<UlidValidator<string>>(rule.ulid());
}

// url
{
  expectType<UrlValidator<string>>(rule.url());
}

// uuid
{
  expectType<UuidValidator<string>>(rule.uuid('v4'));
  rule.uuid();
  rule.uuid('v1');
  rule.uuid('v2');
  rule.uuid('v3');
  rule.uuid('v4');
  rule.uuid('v5');
  rule.uuid(['v1', 'v2']);
  // @ts-expect-error
  rule.uuid('v1', 'v2');
  // @ts-expect-error
  rule.uuid(['1']);
  // @ts-expect-error
  rule.uuid('1');
}
