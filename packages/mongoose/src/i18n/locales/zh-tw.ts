import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（台灣） */
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
  migration: {
    create: '建立遷移檔案',
    up: '執行遷移',
    down: '回溯遷移',
    file_not_found: '遷移檔案「{{file}}」不存在',
    input_file_name: '請輸入遷移檔案名稱：',
    file_created: '遷移檔案已建立「{{file}}」',
  },
});
