import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  eject: 'Експорт списку запланованих завдань',
  start: 'Розпочати заплановане завдання',
  stop: 'Зупиніть заплановані завдання',
  stats: 'Перевірте стан виконання запланованих завдань',
  not_started: 'Заплановане завдання не запущено, порт: {{port}}',
  invalid_cron_time: 'Недійсний вираз cron: {{time}}',
  invalid_port: 'Недійсний порт сервера: {{port}} (дійсний діапазон: 1-65535)',
});
