import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  eject: 'Geplante Aufgabenliste exportieren',
  start: 'Starten Sie eine geplante Aufgabe',
  stop: 'Stoppen Sie geplante Aufgaben',
  stats: 'Überprüfen Sie den Ausführungsstatus geplanter Aufgaben',
  not_started: 'Die geplante Aufgabe wurde nicht gestartet, Port: {{port}}',
  invalid_cron_time: 'Ungültiger Cron-Ausdruck: {{time}}',
  invalid_port: 'Ungültiger Serverport: {{port}} (gültiger Bereich: 1-65535)',
});
