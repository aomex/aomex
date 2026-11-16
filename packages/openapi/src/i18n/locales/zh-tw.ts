import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（台灣） */
export default I18n.satisfies(zh).define({
  initialize: '初始化文件',
  search_routers_files: '搜尋路由檔案',
  parse_routers: '解析路由',
  add_tag: '新增標籤',
  hand_fix_documentation: '手動修正文件',
  optimize_parameter: '最佳化參數',
  save_to_file: '儲存到檔案',
  validate: '驗證文件',
  help_summary: 'OpenAPI v3 文件產生器',
  help_app_listen_tip:
    '請將 new WebApp 與 app.listen 拆開（或僅在入口 listen），避免 CLI import 時副作用起服',
  has_error: '{{error_count}} 個錯誤，{{warning_count}} 筆警告',
  no_error: '沒有錯誤',
});
