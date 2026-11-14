import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} phải thuộc loại Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} phải thuộc loại ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Chưa được hỗ trợ {{validator}}',
  },
  migration: {
    create: 'Tạo tập tin di chuyển',
    up: 'Thực hiện di chuyển',
    down: 'Di chuyển quay lui',
    file_not_found: 'Tệp di chuyển "{{file}}" không tồn tại',
    input_file_name: 'Vui lòng nhập tên tệp di chuyển:',
    file_created: 'Tệp di chuyển đã được tạo thành công "{{file}}"',
  },
});
