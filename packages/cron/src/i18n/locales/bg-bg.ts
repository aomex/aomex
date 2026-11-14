import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  eject: 'Експортирайте списък с планирани задачи',
  start: 'Стартирайте планирана задача',
  stop: 'Спрете планираните задачи',
  stats: 'Проверете състоянието на изпълнение на планираните задачи',
  not_started: 'Планираната задача не е стартирана, порт: {{port}}',
  invalid_cron_time: 'Невалиден cron израз: {{time}}',
});
