import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  initialize: '初期化ドキュメント',
  search_routers_files: 'ルーティングファイルの検索',
  parse_routers: 'ルートを解析する',
  add_tag: 'タグを追加',
  hand_fix_documentation: 'ドキュメントを手動で修復する',
  optimize_parameter: '最適化パラメータ',
  save_to_file: 'ファイルに保存する',
  validate: '文書を確認する',
  help_summary: 'OpenAPI v3 ドキュメント ジェネレーター',
  help_app_listen_tip:
    'new WebApp と app.listen を分けてください（またはエントリでのみ listen）。CLI の import 時にサーバーが副作用で起動するのを防ぎます',
  has_error: '{{error_count}} エラー、{{warning_count}} 警告',
  no_error: 'エラーはありません',
});
