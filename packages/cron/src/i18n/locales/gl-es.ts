import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  eject: 'Exportar a lista de tarefas programadas',
  start: 'Iniciar unha tarefa programada',
  stop: 'Deter as tarefas programadas',
  stats: 'Comproba o estado de execución das tarefas programadas',
  not_started: 'Non se inicia a tarefa programada, porto: {{port}}',
  invalid_cron_time: 'Expresión cron non válida: {{time}}',
});
