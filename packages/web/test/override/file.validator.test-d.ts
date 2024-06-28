import { type TypeEqual, expectType } from 'ts-expect';
import { Validator, type TransformedValidator, rule } from '@aomex/core';
import { FileValidator as TargetValidator } from '../../src';

type DefaultType = TargetValidator.FormidableFile;
const validator = new TargetValidator();

// 可选
{
  const v = validator.optional();
  expectType<TargetValidator<any>>(v);
  expectType<TypeEqual<DefaultType | undefined, Validator.Infer<typeof v>>>(true);
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

// 设置types
{
  validator.mimeTypes('.png');
  validator.mimeTypes('.jpg', '.png', '.gif');
  validator.mimeTypes('image/*');

  const v = validator.mimeTypes('.png');
  expectType<TargetValidator<DefaultType>>(v);
}

// 设置体积
{
  validator.maxSize(1024);
  validator.maxSize('15kb');
  validator.maxSize('15MB');

  const v = validator.maxSize(1024);
  expectType<TargetValidator<DefaultType>>(v);
}

// rule
{
  const v = rule.file();
  expectType<TargetValidator<DefaultType>>(v);
}
