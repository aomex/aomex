import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（台灣） */
export default I18n.satisfies(zh).define({
  initialize: '初始化文件',
  search_channels_files: '搜尋 Channel 檔案',
  parse_channels: '解析 Channel',
  hand_fix_documentation: '手動修正文件',
  save_to_file: '儲存到檔案',
  validate: '驗證文件',
  help_summary: 'AsyncAPI 3 文件產生器',
  has_error: '{{error_count}} 個錯誤，{{warning_count}} 筆警告',
  no_error: '沒有錯誤',
});
