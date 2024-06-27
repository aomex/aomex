import { i18n } from '@aomex/core';

i18n.register('en_US', 'cron', {
  eject: 'Eject cron jobs list',
  start: 'Start cron jobs',
  stop: 'Stop cron jobs',
  stats: 'Show cron jobs stats',
  not_started: 'cron not started with port: {{port}}',
  use_stop:
    'Recommend using command "aomex cron:stop" to stop cron in favor of waiting executing jobs',
});
