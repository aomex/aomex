import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  eject: 'Ekspordi ajastatud ülesannete loend',
  start: 'Alustage ajastatud toimingut',
  stop: 'Peatage ajastatud ülesanded',
  stats: 'Kontrollige ajastatud ülesannete täitmise olekut',
  not_started: 'Ajastatud ülesannet ei käivitata, port: {{port}}',
  invalid_cron_time: 'Kehtetu cron-avaldis: {{time}}',
  invalid_port: 'Kehtetu serveri port: {{port}} (kehtiv vahemik: 1-65535)',
});
