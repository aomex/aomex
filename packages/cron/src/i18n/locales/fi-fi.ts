import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  eject: 'Vie ajoitettu tehtäväluettelo',
  start: 'Aloita ajoitettu tehtävä',
  stop: 'Lopeta ajoitetut tehtävät',
  stats: 'Tarkista ajoitettujen tehtävien suoritustila',
  not_started: 'Ajastettua tehtävää ei ole aloitettu, portti: {{port}}',
  invalid_cron_time: 'Virheellinen cron-lauseke: {{time}}',
  invalid_port: 'Virheellinen palvelinportti: {{port}} (kelvollinen alue: 1-65535)',
});
