import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  eject: 'Eksportēt ieplānoto uzdevumu sarakstu',
  start: 'Sāciet ieplānotu uzdevumu',
  stop: 'Pārtrauciet ieplānotos uzdevumus',
  stats: 'Pārbaudiet plānoto uzdevumu izpildes statusu',
  not_started: 'Ieplānotais uzdevums nav sākts, ports: {{port}}',
  invalid_cron_time: 'Nederīga cron izteiksme: {{time}}',
});
