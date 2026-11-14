import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  eject: 'Eksporter liste over planlagte oppgaver',
  start: 'Start en planlagt oppgave',
  stop: 'Stopp planlagte oppgaver',
  stats: 'Sjekk utførelsesstatusen til planlagte oppgaver',
  not_started: 'Den planlagte oppgaven er ikke startet, port: {{port}}',
  invalid_cron_time: 'Ugyldig cron-uttrykk: {{time}}',
});
