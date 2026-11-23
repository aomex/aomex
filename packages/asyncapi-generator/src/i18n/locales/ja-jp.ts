import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  initialize: '初期化ドキュメント',
  search_channels_files: 'Channel ファイルを検索',
  parse_channels: 'Channel を解析する',
  hand_fix_documentation: 'ドキュメントを手動で修復する',
  save_to_file: 'ファイルに保存する',
  validate: '文書を確認する',
  help_summary: 'AsyncAPI 3 ドキュメント ジェネレーター',
  has_error: '{{error_count}} エラー、{{warning_count}} 警告',
  no_error: 'エラーはありません',
});
