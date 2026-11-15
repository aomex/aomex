import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  eject: "Esporta l'elenco delle attività pianificate",
  start: "Avvia un'attività pianificata",
  stop: 'Interrompi le attività pianificate',
  stats: 'Controlla lo stato di esecuzione delle attività pianificate',
  not_started: "L'attività pianificata non è stata avviata, porta: {{port}}",
  invalid_cron_time: 'Espressione cron non valida: {{time}}',
  invalid_port: 'Porta del server non valida: {{port}} (intervallo valido: 1-65535)',
});
