import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  eject: 'Ekspor daftar tugas terjadwal',
  start: 'Mulai tugas terjadwal',
  stop: 'Hentikan tugas yang dijadwalkan',
  stats: 'Periksa status pelaksanaan tugas yang dijadwalkan',
  not_started: 'Tugas yang dijadwalkan belum dimulai, port: {{port}}',
  invalid_cron_time: 'Ekspresi cron tidak valid: {{time}}',
  invalid_port: 'Port server tidak valid: {{port}} (rentang valid: 1-65535)',
});
