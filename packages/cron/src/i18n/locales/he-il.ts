import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  eject: 'ייצוא רשימת משימות מתוזמנת',
  start: 'התחל משימה מתוזמנת',
  stop: 'עצור משימות מתוזמנות',
  stats: 'בדוק את מצב הביצוע של משימות מתוזמנות',
  not_started: 'המשימה המתוזמנת לא הופעלה, יציאה: {{port}}',
  invalid_cron_time: 'ביטוי קרון לא חוקי: {{time}}',
  invalid_port: 'יציאת שרת לא חוקית: {{port}} (טווח חוקי: 1-65535)',
});
