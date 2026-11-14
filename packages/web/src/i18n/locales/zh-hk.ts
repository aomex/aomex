import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（香港） */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}}必須為檔案',
      too_large: '{{label}}檔案過大',
      unsupported_mimetype: '{{label}}的檔案類型不受支援',
    },
  },
  response: {
    redirect: '正在重定向到 {{url}}',
  },
});
