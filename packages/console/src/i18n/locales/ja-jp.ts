import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  command_not_found: 'コマンド「{{command}}」は存在しません',
  command_found_recommended:
    'コマンド「{{command}}」は存在しません。 「aomex {{recommended}}」のことですか？',
  help: {
    command: '[コマンド]',
    option: '【オプション】',
    version: '{{scriptName}}のバージョン番号を表示します',
    no_usage: 'コマンド「{{command}}」の使用法が見つかりません',
  },
});
