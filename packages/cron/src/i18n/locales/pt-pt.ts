import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-PT */
export default I18n.satisfies(zh).define({
  eject: 'Exportar lista de tarefas agendadas',
  start: 'Iniciar uma tarefa agendada',
  stop: 'Interromper tarefas agendadas',
  stats: 'Verifique o status de execução das tarefas agendadas',
  not_started: 'A tarefa agendada não foi iniciada, porta: {{port}}',
  invalid_cron_time: 'Expressão cron inválida: {{time}}',
});
