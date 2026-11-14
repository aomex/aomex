import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（香港） */
export default I18n.satisfies(zh).define({
  initialize: '初始化文檔',
  search_routers_files: '搜尋路由檔案',
  parse_routers: '解析路由',
  add_tag: '添加標籤',
  hand_fix_documentation: '手動修復文檔',
  optimize_parameter: '優化參數',
  save_to_file: '保存到檔案',
  validate: '驗證文檔',
  help_summary: 'OpenAPI v3 文檔生成器',
  has_error: '{{error_count}} 個錯誤，{{warning_count}} 條警告',
  no_error: '沒有錯誤',
});
