import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  initialize: 'dokumen inisialisasi',
  search_channels_files: 'cari file Channel',
  parse_channels: 'uraikan Channel',
  hand_fix_documentation: 'Perbaiki dokumen secara manual',
  save_to_file: 'simpan ke file',
  validate: 'Verifikasi dokumen',
  help_summary: 'Generator dokumentasi AsyncAPI 3',
  has_error: 'Kesalahan {{error_count}}, peringatan {{warning_count}}',
  no_error: 'tidak ada kesalahan',
});
