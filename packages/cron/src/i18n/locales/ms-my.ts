import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ms-MY */
export default I18n.satisfies(zh).define({
  eject: 'Eksport senarai tugas yang dijadualkan',
  start: 'Mulakan tugas yang dijadualkan',
  stop: 'Hentikan tugas yang dijadualkan',
  stats: 'Semak status pelaksanaan tugas yang dijadualkan',
  not_started: 'Tugas yang dijadualkan tidak dimulakan, port: {{port}}',
  invalid_cron_time: 'Ungkapan cron tidak sah: {{time}}',
  invalid_port: 'Port pelayan tidak sah: {{port}} (julat sah: 1-65535)',
});
