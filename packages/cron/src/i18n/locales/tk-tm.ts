import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tk-TM */
export default I18n.satisfies(zh).define({
  eject: 'Meýilleşdirilen meseleler sanawyny eksport ediň',
  start: 'Meýilleşdirilen işe başlaň',
  stop: 'Meýilleşdirilen işleri bes ediň',
  stats: 'Meýilleşdirilen meseleleriň ýerine ýetirilişini barlaň',
  not_started: 'Meýilleşdirilen mesele başlananok, port: {{port}}',
  invalid_cron_time: 'Nädogry kron aňlatmasy: {{time}}',
  invalid_port: 'Nädogry serwer porty: {{port}} (dogry aralyk: 1-65535)',
});
