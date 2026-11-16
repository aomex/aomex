import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  initialize: 'وثيقة التهيئة',
  search_routers_files: 'البحث في ملفات التوجيه',
  parse_routers: 'طريق التحليل',
  add_tag: 'إضافة علامة',
  hand_fix_documentation: 'إصلاح المستندات يدويًا',
  optimize_parameter: 'معلمات التحسين',
  save_to_file: 'حفظ إلى ملف',
  validate: 'التحقق من الوثيقة',
  help_summary: 'مولد وثائق OpenAPI v3',
  help_app_listen_tip:
    'عند تمرير app، افصل new WebApp عن app.listen (أو نفّذ listen فقط في ملف الدخول) لتجنب تشغيل الخادم كأثر جانبي عند استيراد CLI',
  has_error: 'أخطاء {{error_count}}، تحذيرات {{warning_count}}',
  no_error: 'لا توجد أخطاء',
});
