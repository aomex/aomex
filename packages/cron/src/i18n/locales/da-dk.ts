import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  eject: 'Eksporter liste over planlagte opgaver',
  start: 'Start en planlagt opgave',
  stop: 'Stop planlagte opgaver',
  stats: 'Tjek udførelsesstatus for planlagte opgaver',
  not_started: 'Den planlagte opgave er ikke startet, port: {{port}}',
  invalid_cron_time: 'Ugyldigt cron-udtryk: {{time}}',
});
