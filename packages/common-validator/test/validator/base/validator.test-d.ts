import type { Validator } from '../../../src';
import { expectType, type TypeEqual } from 'ts-expect';

class MyClass {
  say(): string {
    return 'hello';
  }
}

{
  type v = Validator<Date | null>;
  expectType<TypeEqual<Validator.Infer<v>, Date | null>>(true);
}

{
  type Type = Validator.Infer<{
    a: Validator<Date>;
    b: Validator<Set<string>>;
    c: Validator<MyClass>;
  }>;
  expectType<TypeEqual<Type, { a: Date; b: Set<string>; c: MyClass }>>(true);
}

{
  type Type = Validator.Infer<{
    a: Validator<Date | Validator.TOptional>;
    b: Validator<Set<string>>;
    c: Validator<MyClass>;
  }>;
  expectType<TypeEqual<Type, { b: Set<string>; c: MyClass } & { a?: Date | undefined }>>(
    true,
  );
}

{
  type Type = Validator.Infer<{
    a: Validator<Date | Validator.TOptional>;
    b: Validator<Set<string> | Validator.TOptional>;
    c: Validator<MyClass | Validator.TOptional>;
  }>;
  expectType<
    TypeEqual<
      Type,
      {
        a?: Date | undefined;
        b?: Set<string> | undefined;
        c?: MyClass | undefined;
      }
    >
  >(true);
}

{
  type Type = Validator.Infer<{}>;
  expectType<TypeEqual<Type, {}>>(true);
}
