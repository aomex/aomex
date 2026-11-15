import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  eject: 'Exportar lista de tareas programadas',
  start: 'Iniciar una tarea programada',
  stop: 'Detener tareas programadas',
  stats: 'Verificar el estado de ejecución de las tareas programadas',
  not_started: 'La tarea programada no se inicia, puerto: {{port}}',
  invalid_cron_time: 'Expresión cron no válida: {{time}}',
  invalid_port: 'Puerto de servidor no válido: {{port}} (rango válido: 1-65535)',
});
