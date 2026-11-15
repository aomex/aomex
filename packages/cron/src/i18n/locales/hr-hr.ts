import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  eject: 'Izvoz popisa planiranih zadataka',
  start: 'Započnite planirani zadatak',
  stop: 'Zaustavite planirane zadatke',
  stats: 'Provjerite status izvršenja planiranih zadataka',
  not_started: 'Planirani zadatak nije pokrenut, port: {{port}}',
  invalid_cron_time: 'Nevažeći cron izraz: {{time}}',
  invalid_port: 'Nevažeći poslužiteljski port: {{port}} (važeći raspon: 1-65535)',
});
