import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  eject: 'طے شدہ کام کی فہرست برآمد کریں۔',
  start: 'ایک طے شدہ کام شروع کریں۔',
  stop: 'طے شدہ کاموں کو روکیں۔',
  stats: 'طے شدہ کاموں کے عمل کی حیثیت کو چیک کریں۔',
  not_started: 'طے شدہ کام شروع نہیں ہوا ہے، پورٹ: {{port}}',
  invalid_cron_time: 'غلط کرون اظہار: {{time}}',
});
