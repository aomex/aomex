import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（香港） */
export default I18n.satisfies(zh).define({
  command_not_found: '命令「{{command}}」不存在',
  command_found_recommended:
    '命令「{{command}}」不存在，你是指「aomex {{recommended}}」嗎？',
  help: {
    command: '[命令]',
    option: '[選項]',
    version: '顯示 {{scriptName}} 的版本號',
    no_usage: '找不到命令「{{command}}」的用法',
  },
});
