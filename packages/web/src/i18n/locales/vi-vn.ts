import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} Phải là một tập tin',
      too_large: '{{label}} Tệp quá lớn',
      unsupported_mimetype: 'Loại tệp {{label}} không được hỗ trợ',
      invalid_mimetype_token:
        'Loại phương tiện hoặc phần mở rộng tệp không hợp lệ: {{token}}',
    },
  },
  response: {
    redirect: 'Đang chuyển hướng tới {{url}}',
  },
});
