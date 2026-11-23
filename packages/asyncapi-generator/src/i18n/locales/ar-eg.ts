import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  initialize: 'وثيقة التهيئة',
  search_channels_files: 'البحث عن ملفات Channel',
  parse_channels: 'تحليل Channel',
  hand_fix_documentation: 'إصلاح المستندات يدويًا',
  save_to_file: 'حفظ إلى ملف',
  validate: 'التحقق من الوثيقة',
  help_summary: 'مولّد وثائق AsyncAPI 3',
  has_error: 'أخطاء {{error_count}}، تحذيرات {{warning_count}}',
  no_error: 'لا توجد أخطاء',
});
