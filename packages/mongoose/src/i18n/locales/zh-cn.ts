import { I18n } from '@aomex/common';

export const zh = I18n.define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}}：必须是 Decimal128 类型',
    },
    objectId: {
      must_be_objectId: '{{label}}：必须是 ObjectId 类型',
    },
  },
  mongoose: {
    unsupported_validator: '暂不支持 {{validator}} 验证器',
  },
});
