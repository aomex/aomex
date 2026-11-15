import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ga-IE */
export default I18n.satisfies(zh).define({
  eject: 'Easpórtáil liosta tascanna sceidealta',
  start: 'Tosaigh tasc sceidealta',
  stop: 'Stop tascanna sceidealta',
  stats: 'Seiceáil stádas forghníomhaithe na dtascanna sceidealta',
  not_started: 'Níl an tasc sceidealta tosaithe, port: {{port}}',
  invalid_cron_time: 'Slonn neamhbhailí cron: {{time}}',
  invalid_port: 'Port freastalaí neamhbhailí: {{port}} (raon bailí: 1-65535)',
});
