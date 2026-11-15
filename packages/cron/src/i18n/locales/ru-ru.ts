import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  eject: 'Экспортировать список запланированных задач',
  start: 'Запустить запланированное задание',
  stop: 'Остановить запланированные задачи',
  stats: 'Проверка статуса выполнения запланированных задач',
  not_started: 'Запланированное задание не запущено, порт: {{port}}',
  invalid_cron_time: 'Недопустимое выражение cron: {{time}}.',
  invalid_port: 'Недопустимый порт сервера: {{port}} (допустимый диапазон: 1-65535)',
});
