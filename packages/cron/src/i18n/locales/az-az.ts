import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** az-AZ */
export default I18n.satisfies(zh).define({
  eject: 'Planlaşdırılmış tapşırıq siyahısını ixrac edin',
  start: 'Planlaşdırılmış tapşırığa başlayın',
  stop: 'Planlaşdırılmış tapşırıqları dayandırın',
  stats: 'Planlaşdırılmış tapşırıqların icra vəziyyətini yoxlayın',
  not_started: 'Planlaşdırılmış tapşırıq başlamadı, port: {{port}}',
  invalid_cron_time: 'Yanlış cron ifadəsi: {{time}}',
});
