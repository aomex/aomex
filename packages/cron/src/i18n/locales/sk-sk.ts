import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  eject: 'Exportovať zoznam naplánovaných úloh',
  start: 'Spustite naplánovanú úlohu',
  stop: 'Zastavte naplánované úlohy',
  stats: 'Skontrolujte stav vykonávania naplánovaných úloh',
  not_started: 'Naplánovaná úloha nie je spustená, port: {{port}}',
  invalid_cron_time: 'Neplatný výraz cron: {{time}}',
  invalid_port: 'Neplatný port servera: {{port}} (platný rozsah: 1-65535)',
});
