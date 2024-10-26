import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  eject: 'Eject cron tasks to crontab',
  start: 'Start cron tasks',
  stop: 'Stop cron tasks',
  stats: 'Show cron tasks stats',
  not_started: 'cron not started with port: {{port}}',
});
