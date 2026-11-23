import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（香港） */
export default I18n.satisfies(zh).define({
  initialize: '初始化文檔',
  search_channels_files: '搜尋 Channel 檔案',
  parse_channels: '解析 Channel',
  hand_fix_documentation: '手動修復文檔',
  save_to_file: '保存到檔案',
  validate: '驗證文檔',
  help_summary: 'AsyncAPI 3 文檔生成器',
  has_error: '{{error_count}} 個錯誤，{{warning_count}} 條警告',
  no_error: '沒有錯誤',
});
