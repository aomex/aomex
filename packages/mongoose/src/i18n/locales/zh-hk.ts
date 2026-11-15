import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（香港） */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}}必須是 Decimal128 類型',
    },
    objectId: {
      must_be_objectId: '{{label}}必須是 ObjectId 類型',
    },
  },
  mongoose: {
    unsupported_validator: '暫不支援 {{validator}}',
  },
});
