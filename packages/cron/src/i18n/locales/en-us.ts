import { I18n } from '@aomex/core';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  eject: 'Eject cron jobs list',
  start: 'Start cron jobs',
  stop: 'Stop cron jobs',
  stats: 'Show cron jobs stats',
  not_started: 'cron not started with port: {{port}}',
});
