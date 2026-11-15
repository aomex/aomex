import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  eject: 'Exportera schemalagd uppgiftslista',
  start: 'Starta en schemalagd uppgift',
  stop: 'Stoppa schemalagda uppgifter',
  stats: 'Kontrollera exekveringsstatusen för schemalagda uppgifter',
  not_started: 'Den schemalagda uppgiften startas inte, port: {{port}}',
  invalid_cron_time: 'Ogiltigt cron-uttryck: {{time}}',
  invalid_port: 'Ogiltig serverport: {{port}} (giltigt intervall: 1-65535)',
});
