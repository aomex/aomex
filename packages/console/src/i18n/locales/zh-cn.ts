import { i18n } from '@aomex/core';

i18n.register('zh_CN', 'console', {
  command_not_found: '指令"{{command}}"不存在',
  command_found_recommended: {
    message: '指令"{{command}}"不存在，你是在找这些指令吗：{{recommended}}',
    args: {
      recommended(arg) {
        return arg.join('、');
      },
    },
  },
});
