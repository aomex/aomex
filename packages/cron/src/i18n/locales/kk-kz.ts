import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  eject: 'Жоспарланған тапсырмалар тізімін экспорттау',
  start: 'Жоспарланған тапсырманы бастаңыз',
  stop: 'Жоспарланған тапсырмаларды тоқтатыңыз',
  stats: 'Жоспарланған тапсырмалардың орындалу күйін тексеріңіз',
  not_started: 'Жоспарланған тапсырма іске қосылмаған, порт: {{port}}',
  invalid_cron_time: 'Жарамсыз cron өрнегі: {{time}}',
  invalid_port: 'Жарамсыз сервер порты: {{port}} (жарамды диапазон: 1-65535)',
});
