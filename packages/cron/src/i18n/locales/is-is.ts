import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  eject: 'Flytja út skipulagðan verkefnalista',
  start: 'Byrjaðu skipulagt verkefni',
  stop: 'Stöðva skipulögð verkefni',
  stats: 'Athugaðu framkvæmdarstöðu áætlaðra verkefna',
  not_started: 'Áætlað verkefni er ekki ræst, höfn: {{port}}',
  invalid_cron_time: 'Ógild cron tjáning: {{time}}',
  invalid_port: 'Ógildur netþjónshöfn: {{port}} (gilt svið: 1-65535)',
});
