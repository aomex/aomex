import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  initialize: 'ابتدائی دستاویز',
  search_channels_files: 'Channel فائلیں تلاش کریں',
  parse_channels: 'Channel پارس کریں',
  hand_fix_documentation: 'دستی طور پر دستاویزات کی مرمت کریں۔',
  save_to_file: 'فائل میں محفوظ کریں۔',
  validate: 'دستاویز کی تصدیق کریں۔',
  help_summary: 'AsyncAPI 3 دستاویز جنریٹر',
  has_error: '{{error_count}} غلطیاں، {{warning_count}} انتباہات',
  no_error: 'کوئی غلطیاں نہیں',
});
