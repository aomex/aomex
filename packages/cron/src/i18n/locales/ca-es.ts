import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  eject: 'Exporta la llista de tasques programades',
  start: 'Inicieu una tasca programada',
  stop: 'Atura les tasques programades',
  stats: "Comproveu l'estat d'execució de les tasques programades",
  not_started: "La tasca programada no s'ha iniciat, port: {{port}}",
  invalid_cron_time: 'Expressió cron no vàlida: {{time}}',
  invalid_port: 'Port de servidor no vàlid: {{port}} (interval vàlid: 1-65535)',
});
