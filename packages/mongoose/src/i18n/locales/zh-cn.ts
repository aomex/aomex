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
  migration: {
    create: '创建迁移文件',
    up: '执行迁移逻辑',
    down: '回滚迁移逻辑',
    file_not_found: "迁移文件 '{{file}}' 不存在",
    input_file_name: '迁移文件名是什么？',
  },
});
