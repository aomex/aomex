import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  eject: 'Eksportuokite suplanuotų užduočių sąrašą',
  start: 'Pradėkite suplanuotą užduotį',
  stop: 'Sustabdykite suplanuotas užduotis',
  stats: 'Patikrinkite suplanuotų užduočių vykdymo būseną',
  not_started: 'Suplanuota užduotis nepradėta, prievadas: {{port}}',
  invalid_cron_time: 'Netinkama cron išraiška: {{time}}',
});
