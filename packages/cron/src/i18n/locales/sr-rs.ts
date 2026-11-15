import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  eject: 'Извезите листу заказаних задатака',
  start: 'Започните заказани задатак',
  stop: 'Зауставите заказане задатке',
  stats: 'Проверите статус извршења заказаних задатака',
  not_started: 'Планирани задатак није покренут, порт: ЗЗ0ЗЗ',
  invalid_cron_time: 'Неважећи црон израз: ЗЗ0ЗЗ',
  invalid_port: 'Неважећи порт сервера: {{port}} (важећи опсег: 1-65535)',
});
