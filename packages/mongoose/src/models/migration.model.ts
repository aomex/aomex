import { rule } from '@aomex/common';
import { defineMongooseModel } from '../define-mongoose-model';

export const MigrationModel = defineMongooseModel('__aomex_migration__', {
  schemas: {
    filename: rule.string(),
    finished_at: rule.date().nullable(),
  },
  versionKey: false,
  timestamps: { createdAt: 'created_at', updatedAt: false },
  indexes: [
    {
      fields: { filename: 'asc' },
      unique: true,
    },
  ],
});
