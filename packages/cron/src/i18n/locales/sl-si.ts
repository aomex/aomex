import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  eject: 'Izvoz načrtovanega seznama opravil',
  start: 'Začnite načrtovano opravilo',
  stop: 'Ustavite načrtovana opravila',
  stats: 'Preverite stanje izvajanja načrtovanih opravil',
  not_started: 'Načrtovano opravilo ni zagnano, vrata: {{port}}',
  invalid_cron_time: 'Neveljaven cron izraz: {{time}}',
});
