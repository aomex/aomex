import { I18n } from '@aomex/common';

export const zh = I18n.define({
  command_not_found: '命令「{{command}}」不存在',
  command_found_recommended:
    '命令「{{command}}」不存在，你是说「aomex {{recommended}}」吗？',
  help: {
    command: '[命令]',
    option: '[选项]',
    version: '显示 {{scriptName}} 的版本号',
    no_usage: '找不到命令「{{command}}」的用法',
  },
});
