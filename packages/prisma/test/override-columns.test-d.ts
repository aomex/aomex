import { BooleanValidator, rule, StringValidator, Validator } from '@aomex/common';
import { overrideColumnsFactory } from '../src';
import { expectType, type TypeEqual } from 'ts-expect';

type PrismaSchemaMap = {
  user: ['id', 'name', 'age', 'address'];
  admin: ['nickname', 'email', 'password'];
};

overrideColumnsFactory<PrismaSchemaMap>()({
  admin: {
    // @ts-expect-error
    nickname: {
      input: rule.string(),
    },
  },
});

overrideColumnsFactory<PrismaSchemaMap>()({
  admin: {
    // @ts-expect-error
    nickname: {
      output: rule.string(),
    },
  },
});

overrideColumnsFactory<PrismaSchemaMap>()({
  user: {
    age: {
      input: rule.boolean().default(true),
      output: rule.string(),
    },
  },
  admin: {
    // @ts-expect-error
    nickname: {},
  },
});

const columns = overrideColumnsFactory<PrismaSchemaMap>()({
  user: {
    name: {
      input: rule.boolean().default(true),
      output: rule.string(),
    },
  },
});

expectType<
  TypeEqual<
    {
      input: BooleanValidator<boolean | Validator.TDefault>;
      output: StringValidator<string>;
    },
    (typeof columns)['user']['name']
  >
>(true);

expectType<
  TypeEqual<
    { input?: undefined; output?: undefined } | undefined,
    (typeof columns)['user']['age']
  >
>(true);

columns.user.name.input.optional();
columns.user.name.output.nullable();
// @ts-expect-error
columns.user.id.input;
// @ts-expect-error
columns.user.id?.input.optional();
