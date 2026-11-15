import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  eject: 'Exporter la liste des tâches planifiées',
  start: 'Démarrer une tâche planifiée',
  stop: 'Arrêter les tâches planifiées',
  stats: "Vérifier l'état d'exécution des tâches planifiées",
  not_started: "La tâche planifiée n'est pas démarrée, port : {{port}}",
  invalid_cron_time: 'Expression cron invalide : {{time}}',
  invalid_port: 'Port de serveur invalide : {{port}} (plage valide : 1-65535)',
});
