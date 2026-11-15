import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uz-UZ */
export default I18n.satisfies(zh).define({
  eject: 'Rejalashtirilgan vazifalar roʻyxatini eksport qilish',
  start: 'Rejalashtirilgan vazifani boshlang',
  stop: "Rejalashtirilgan vazifalarni to'xtating",
  stats: 'Rejalashtirilgan vazifalarning bajarilishi holatini tekshiring',
  not_started: 'Rejalashtirilgan vazifa boshlanmadi, port: {{port}}',
  invalid_cron_time: 'Yaroqsiz cron ifodasi: {{time}}',
  invalid_port: 'Yaroqsiz server porti: {{port}} (yaroqli diapazon: 1-65535)',
});
