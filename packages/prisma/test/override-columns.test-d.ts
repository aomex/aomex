import { BooleanValidator, rule, StringValidator, Validator } from '@aomex/common';
import { overrideColumns } from '../src';
import { expectType, type TypeEqual } from 'ts-expect';

type PrismaSchemaMap = {
  user: ['id', 'name', 'age', 'address'];
  admin: ['nickname', 'email', 'password'];
};

overrideColumns<PrismaSchemaMap>()({
  admin: {
    // @ts-expect-error
    nickname: {
      input: rule.string(),
    },
  },
});

overrideColumns<PrismaSchemaMap>()({
  admin: {
    // @ts-expect-error
    nickname: {
      output: rule.string(),
    },
  },
});

overrideColumns<PrismaSchemaMap>()({
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

const columns = overrideColumns<PrismaSchemaMap>()({
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
