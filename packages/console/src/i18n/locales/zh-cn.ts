import { i18n } from '@aomex/core';

i18n.register('zh_CN', 'console', {
  command_not_found: '指令 "{{command}}" 不存在',
  command_found_recommended:
    '指令 "{{command}}" 不存在，你是说 "aomex {{recommended}}" 吗？',
  help: {
    command: '[指令]',
    option: '[选项]',
    version: '显示{{scriptName}}版本号',
    no_usage: '找不到关于指令 "{{command}}" 的用法',
  },
});
