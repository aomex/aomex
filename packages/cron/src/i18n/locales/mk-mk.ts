import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  eject: 'Извезете список со закажани задачи',
  start: 'Започнете со закажана задача',
  stop: 'Престанете со закажаните задачи',
  stats: 'Проверете го статусот на извршување на закажаните задачи',
  not_started: 'Закажаната задача не е започната, порта: {{port}}',
  invalid_cron_time: 'Неважечки cron израз: {{time}}',
  invalid_port: 'Неважечка серверска порта: {{port}} (важечки опсег: 1-65535)',
});
