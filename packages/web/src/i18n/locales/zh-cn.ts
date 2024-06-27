import { i18n } from '@aomex/core';

i18n.register('zh_CN', 'web', {
  validator: {
    file: {
      must_be_file: '{{label}}：必须是文件类型',
      too_large: '{{label}}：文件体积太大',
      unsupported_mimetype: '{{label}}：不支持的文件类型',
    },
  },
  response: {
    redirect: '正在重定向到 {{url}}',
  },
});
