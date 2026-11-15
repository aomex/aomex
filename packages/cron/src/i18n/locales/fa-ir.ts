import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  eject: 'لیست وظایف برنامه ریزی شده را صادر کنید',
  start: 'یک کار برنامه ریزی شده را شروع کنید',
  stop: 'کارهای برنامه ریزی شده را متوقف کنید',
  stats: 'وضعیت اجرای وظایف برنامه ریزی شده را بررسی کنید',
  not_started: 'کار برنامه ریزی شده شروع نشده است، پورت: {{port}}',
  invalid_cron_time: 'عبارت cron نامعتبر است: {{time}}',
  invalid_port: 'پورت سرور نامعتبر: {{port}} (محدوده معتبر: 1-65535)',
});
