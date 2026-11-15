import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  eject: 'Geplande takenlijst exporteren',
  start: 'Een geplande taak starten',
  stop: 'Stop geplande taken',
  stats: 'Controleer de uitvoeringsstatus van geplande taken',
  not_started: 'De geplande taak is niet gestart, poort: {{port}}',
  invalid_cron_time: 'Ongeldige cron-expressie: {{time}}',
  invalid_port: 'Ongeldige serverpoort: {{port}} (geldig bereik: 1-65535)',
});
