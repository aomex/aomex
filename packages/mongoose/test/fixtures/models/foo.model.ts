import { rule } from '@aomex/common';
import { defineMongooseModel } from '../../../src';

export const FooModel = defineMongooseModel('foo', {
  schemas: {
    abc: rule.string().optional(),
    bar: rule.string().optional(),
  },
  indexes: [{ fields: { abc: -1 } }],
  versionKey: false,
  timestamps: false,
  autoIndex: false,
});
