import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  initialize: 'سند اولیه',
  search_channels_files: 'جستجوی فایل‌های Channel',
  parse_channels: 'تجزیه Channel',
  hand_fix_documentation: 'اسناد را به صورت دستی تعمیر کنید',
  save_to_file: 'ذخیره در فایل',
  validate: 'تایید سند',
  help_summary: 'تولیدکننده مستندات AsyncAPI 3',
  has_error: 'خطاهای {{error_count}}، هشدارهای {{warning_count}}',
  no_error: 'بدون خطا',
});
