import { expect, test } from 'vitest';
import { rule, schema, validate } from '@aomex/common';
import { definePrismaSchema } from '../src';
import { asPrismaGenerated } from '../src/define-prisma-schema';

const userInputSchema = schema({
  id: rule.int().optional(),
  name: rule.string(),
  password: rule.string(),
});

const userOutputSchema = schema({
  id: rule.int(),
  name: rule.string(),
  password: rule.string(),
});

const postInputSchema = schema({
  title: rule.string(),
});

const postOutputSchema = schema({
  title: rule.string(),
});

const LanguageEnum = <const>['Typescript', 'Javascript'];

const generated = asPrismaGenerated({
  prismaInput: {
    user: userInputSchema,
    post: postInputSchema,
  },
  prismaOutput: {
    user: userOutputSchema,
    post: postOutputSchema,
  },
  prismaEnum: {
    language: LanguageEnum,
  },
});

test('无覆盖时原样返回 input / output / enum', () => {
  const { prismaInput, prismaOutput, prismaEnum } = definePrismaSchema(generated, {});
  expect(prismaInput.user).toBe(userInputSchema);
  expect(prismaOutput.user).toBe(userOutputSchema);
  expect(prismaInput.post).toBe(postInputSchema);
  expect(prismaOutput.post).toBe(postOutputSchema);
  expect(prismaEnum.language).toBe(LanguageEnum);
});

test('只覆盖 input 时 output / 其他模型 / enum 不变', async () => {
  const { prismaInput, prismaOutput, prismaEnum } = definePrismaSchema(generated, {
    user: {
      input: (s) =>
        s.extend({
          password: rule.string().transform((v) => `hashed:${v}`),
        }),
    },
  });

  expect(prismaInput.user).not.toBe(userInputSchema);
  expect(prismaOutput.user).toBe(userOutputSchema);
  expect(prismaInput.post).toBe(postInputSchema);
  expect(prismaOutput.post).toBe(postOutputSchema);
  expect(prismaEnum.language).toBe(LanguageEnum);

  await expect(
    validate({ name: 'tom', password: 'secret' }, prismaInput.user),
  ).resolves.toStrictEqual({
    name: 'tom',
    password: 'hashed:secret',
    id: undefined,
  });
});

test('只覆盖 output 时 input / 其他模型 / enum 不变', async () => {
  const { prismaInput, prismaOutput, prismaEnum } = definePrismaSchema(generated, {
    user: {
      output: (s) => s.omit('password'),
    },
  });

  expect(prismaInput.user).toBe(userInputSchema);
  expect(prismaOutput.user).not.toBe(userOutputSchema);
  expect(prismaInput.post).toBe(postInputSchema);
  expect(prismaOutput.post).toBe(postOutputSchema);
  expect(prismaEnum.language).toBe(LanguageEnum);

  await expect(
    validate({ id: 1, name: 'tom', password: 'secret' }, prismaOutput.user),
  ).resolves.toStrictEqual({
    id: 1,
    name: 'tom',
  });
});

test('同时覆盖 input / output', async () => {
  const { prismaInput, prismaOutput, prismaEnum } = definePrismaSchema(generated, {
    user: {
      input: (s) =>
        s.extend({
          password: rule.string().transform((v) => `hashed:${v}`),
        }),
      output: (s) => s.omit('password'),
    },
  });

  expect(prismaInput.user).not.toBe(userInputSchema);
  expect(prismaOutput.user).not.toBe(userOutputSchema);
  expect(prismaInput.post).toBe(postInputSchema);
  expect(prismaOutput.post).toBe(postOutputSchema);
  expect(prismaEnum.language).toBe(LanguageEnum);

  await expect(
    validate({ name: 'tom', password: 'secret' }, prismaInput.user),
  ).resolves.toStrictEqual({
    name: 'tom',
    password: 'hashed:secret',
    id: undefined,
  });

  await expect(
    validate({ id: 1, name: 'tom', password: 'secret' }, prismaOutput.user),
  ).resolves.toStrictEqual({
    id: 1,
    name: 'tom',
  });
});

test('多模型同时覆盖互不影响', async () => {
  const { prismaInput, prismaOutput } = definePrismaSchema(generated, {
    user: {
      output: (s) => s.omit('password'),
    },
    post: {
      input: (s) => s.extend({ draft: rule.boolean().optional() }),
    },
  });

  expect(prismaInput.user).toBe(userInputSchema);
  expect(prismaOutput.user).not.toBe(userOutputSchema);
  expect(prismaInput.post).not.toBe(postInputSchema);
  expect(prismaOutput.post).toBe(postOutputSchema);

  await expect(
    validate({ title: 'hi', draft: true }, prismaInput.post),
  ).resolves.toStrictEqual({
    title: 'hi',
    draft: true,
  });
});

test('覆盖不会污染原始 generated', () => {
  definePrismaSchema(generated, {
    user: {
      input: (s) => s.omit('password'),
      output: (s) => s.omit('password'),
    },
  });

  const again = definePrismaSchema(generated, {});
  expect(again.prismaInput.user).toBe(userInputSchema);
  expect(again.prismaOutput.user).toBe(userOutputSchema);
});

test('override 键撞到原型属性名时被忽略', () => {
  const { prismaInput, prismaOutput } = definePrismaSchema(generated, {
    toString: {
      input: () => schema({ hacked: rule.string() }),
      output: () => schema({ hacked: rule.string() }),
    },
  } as never);

  expect(prismaInput.user).toBe(userInputSchema);
  expect(prismaOutput.user).toBe(userOutputSchema);
  expect(Object.hasOwn(prismaInput, 'toString')).toBe(false);
});

test('覆盖后自动补回 asName，显式 asName 不被覆盖', () => {
  const namedGenerated = asPrismaGenerated({
    prismaInput: {
      user: userInputSchema.asName('userInput'),
    },
    prismaOutput: {
      user: userOutputSchema.asName('userOutput'),
    },
    prismaEnum: {},
  });

  const restored = definePrismaSchema(namedGenerated, {
    user: {
      input: (s) => s.omit('password'),
      output: (s) => s.omit('password'),
    },
  });
  expect(restored.prismaInput.user['name']).toBe('userInput');
  expect(restored.prismaOutput.user['name']).toBe('userOutput');

  const custom = definePrismaSchema(namedGenerated, {
    user: {
      output: (s) => s.omit('password').asName('UserPublic'),
    },
  });
  expect(custom.prismaOutput.user['name']).toBe('UserPublic');
});

test('空 prismaEnum 可解包', () => {
  const emptyEnumGenerated = asPrismaGenerated({
    prismaInput: { post: postInputSchema },
    prismaOutput: { post: postOutputSchema },
    prismaEnum: {},
  });
  const { prismaEnum } = definePrismaSchema(emptyEnumGenerated, {});
  expect(prismaEnum).toStrictEqual({});
});

test('返回的 prismaInput 是浅拷贝，可独立改键', () => {
  const first = definePrismaSchema(generated, {});
  Reflect.deleteProperty(first.prismaInput, 'user');

  const second = definePrismaSchema(generated, {});
  expect(second.prismaInput.user).toBe(userInputSchema);
  expect(Object.hasOwn(first.prismaInput, 'user')).toBe(false);
});
