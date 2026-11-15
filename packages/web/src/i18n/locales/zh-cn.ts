import { I18n } from '@aomex/common';

export const zh = I18n.define({
  validator: {
    file: {
      must_be_file: '{{label}}必须为文件',
      too_large: '{{label}}文件过大',
      unsupported_mimetype: '{{label}}的文件类型不受支持',
      invalid_mimetype_token: '无效的媒体类型或文件扩展名：{{token}}',
    },
  },
  response: {
    redirect: '正在重定向到 {{url}}',
  },
});
