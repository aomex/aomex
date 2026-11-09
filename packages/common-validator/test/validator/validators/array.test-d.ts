import { type TypeEqual, expectType } from 'ts-expect';
import {
  ArrayValidator as TargetValidator,
  Validator,
  type TransformedValidator,
  rule,
} from '../../../src';

type DefaultType = unknown[];
const validator = new TargetValidator();

// 可选
{
  const v = validator.optional();
  expectType<TargetValidator<any>>(v);
  expectType<TypeEqual<DefaultType | undefined, Validator.Infer<typeof v>>>(true);
}

// nullable
{
  const v = validator.nullable();
  expectType<TargetValidator<any>>(v);
  expectType<TypeEqual<DefaultType | null, Validator.Infer<typeof v>>>(true);
}

// 默认值
{
  const v = validator.optional().default([]);
  expectType<TargetValidator<any>>(v);
  expectType<TypeEqual<DefaultType, Validator.Infer<typeof v>>>(true);
}

// 转换函数
{
  const v = validator.transform(async (data) => {
    expectType<TypeEqual<DefaultType, typeof data>>(true);
    return '';
  });
  expectType<TransformedValidator<string>>(v);
  expectType<TypeEqual<string, Validator.Infer<typeof v>>>(true);
}

// 文档
{
  const v = validator.docs({ title: '' });
  expectType<TargetValidator<DefaultType>>(v);
}

// 强制转换
{
  validator.forceToArray('separator');
  validator.forceToArray('block');
  // @ts-expect-error
  validator.forceToArray('block', '-');

  const v1 = validator.forceToArray('separator', '-');
  expectType<TargetValidator<DefaultType>>(v1);
  const v2 = validator.forceToArray('block');
  expectType<TargetValidator<DefaultType>>(v2);
}

// 长度
{
  const v1 = validator.length(2);
  expectType<TargetValidator<DefaultType>>(v1);
  const v2 = validator.length({ min: 2 });
  expectType<TargetValidator<DefaultType>>(v2);
  const v3 = validator.length({ max: 3, min: 2 });
  expectType<TargetValidator<DefaultType>>(v3);
}

// 唯一
{
  const strings = rule.array(rule.string());
  expectType<TargetValidator<string[]>>(strings.unique());
  expectType<TypeEqual<string[], Validator.Infer<typeof strings>>>(true);
  strings.unique((item) => {
    expectType<TypeEqual<string, typeof item>>(true);
    return item;
  });
  // @ts-expect-error 原始值数组不允许传 key
  strings.unique('id');
  // @ts-expect-error
  strings.unique('length');

  const numbers = rule.array(rule.number());
  numbers.unique();
  numbers.unique((item) => {
    expectType<TypeEqual<number, typeof item>>(true);
    return item;
  });
  // @ts-expect-error
  numbers.unique('id');

  const unknownItems = rule.array();
  unknownItems.unique();
  unknownItems.unique((item) => {
    expectType<TypeEqual<unknown, typeof item>>(true);
    return item;
  });
  // @ts-expect-error unknown 元素不允许传 key
  unknownItems.unique('id');

  const objects = rule.array(
    rule.object({
      id: rule.int(),
      name: rule.string(),
    }),
  );
  expectType<TargetValidator<{ id: number; name: string }[]>>(objects.unique());
  const byKey = objects.unique('id');
  expectType<TargetValidator<{ id: number; name: string }[]>>(byKey);
  expectType<TypeEqual<{ id: number; name: string }[], Validator.Infer<typeof byKey>>>(
    true,
  );
  objects.unique('name');
  // @ts-expect-error 只能是固定 key
  objects.unique('nope');
  // @ts-expect-error 不支持路径字符串
  objects.unique('id.name');
  // @ts-expect-error
  objects.unique(1);
  objects.unique((item) => {
    expectType<TypeEqual<{ id: number; name: string }, typeof item>>(true);
    return item.id;
  });

  const nested = rule.array(
    rule.object({
      profile: rule.object({
        code: rule.string(),
      }),
    }),
  );
  nested.unique('profile');
  // @ts-expect-error 嵌套字段只能用函数
  nested.unique('profile.code');
  nested.unique((item) => {
    expectType<TypeEqual<{ profile: { code: string } }, typeof item>>(true);
    return item.profile.code;
  });

  const optional = rule.array(rule.string()).optional().unique();
  expectType<TypeEqual<string[] | undefined, Validator.Infer<typeof optional>>>(true);

  const nullable = rule.array(rule.string()).nullable().unique();
  expectType<TypeEqual<string[] | null, Validator.Infer<typeof nullable>>>(true);

  const withDefault = rule.array(rule.string()).default([]).unique();
  expectType<TypeEqual<string[], Validator.Infer<typeof withDefault>>>(true);
}
