import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  eject: 'Экспартаваць спіс запланаваных задач',
  start: 'Пачніце запланаванае заданне',
  stop: 'Спыніць запланаваныя задачы',
  stats: 'Праверце стан выканання запланаваных задач',
  not_started: 'Запланаванае заданне не запушчана, порт: {{port}}',
  invalid_cron_time: 'Няправільны выраз cron: {{time}}',
});
