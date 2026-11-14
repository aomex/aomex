import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  eject: 'Export seznamu naplánovaných úkolů',
  start: 'Spusťte naplánovanou úlohu',
  stop: 'Zastavte naplánované úlohy',
  stats: 'Zkontrolujte stav provádění naplánovaných úloh',
  not_started: 'Naplánovaná úloha není spuštěna, port: {{port}}',
  invalid_cron_time: 'Neplatný cron výraz: {{time}}',
});
