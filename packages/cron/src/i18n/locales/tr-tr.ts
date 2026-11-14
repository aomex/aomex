import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  eject: 'Zamanlanmış görev listesini dışa aktar',
  start: 'Zamanlanmış bir görevi başlatın',
  stop: 'Zamanlanmış görevleri durdur',
  stats: 'Zamanlanmış görevlerin yürütme durumunu kontrol edin',
  not_started: 'Zamanlanmış görev başlatılmadı, bağlantı noktası: {{port}}',
  invalid_cron_time: 'Geçersiz cron ifadesi: {{time}}',
});
