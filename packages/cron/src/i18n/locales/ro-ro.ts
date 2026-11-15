import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  eject: 'Exportați lista de activități programate',
  start: 'Începeți o sarcină programată',
  stop: 'Opriți sarcinile programate',
  stats: 'Verificați starea de execuție a sarcinilor programate',
  not_started: 'Sarcina programată nu este pornită, port: {{port}}',
  invalid_cron_time: 'Expresie cron nevalidă: {{time}}',
  invalid_port: 'Port de server nevalid: {{port}} (interval valid: 1-65535)',
});
