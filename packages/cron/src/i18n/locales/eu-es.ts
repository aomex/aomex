import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** eu-ES */
export default I18n.satisfies(zh).define({
  eject: 'Esportatu programatutako zereginen zerrenda',
  start: 'Hasi programatutako zeregin bat',
  stop: 'Gelditu programatutako zereginak',
  stats: 'Egiaztatu programatutako zereginen exekuzio-egoera',
  not_started: 'Programatutako zeregina ez da hasi, ataka: {{port}}',
  invalid_cron_time: 'Cron adierazpen baliogabea: {{time}}',
  invalid_port: 'Zerbitzari-portu baliogabea: {{port}} (baliozko tartea: 1-65535)',
});
