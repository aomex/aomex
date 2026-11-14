import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  eject: 'تصدير قائمة المهام المجدولة',
  start: 'ابدأ مهمة مجدولة',
  stop: 'إيقاف المهام المجدولة',
  stats: 'التحقق من حالة تنفيذ المهام المجدولة',
  not_started: 'لم يتم بدء المهمة المجدولة، المنفذ: {{port}}',
  invalid_cron_time: 'تعبير cron غير صالح: {{time}}',
});
