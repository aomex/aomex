import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  initialize: 'dokumen inisialisasi',
  search_routers_files: 'Cari file perutean',
  parse_routers: 'menguraikan rute',
  add_tag: 'Tambahkan tanda',
  hand_fix_documentation: 'Perbaiki dokumen secara manual',
  optimize_parameter: 'Parameter optimasi',
  save_to_file: 'simpan ke file',
  validate: 'Verifikasi dokumen',
  help_summary: 'Generator dokumentasi OpenAPI v3',
  help_app_listen_tip:
    'Pisahkan new WebApp dari app.listen (atau listen hanya di file entri) agar impor CLI tidak menjalankan server sebagai efek samping',
  has_error: 'Kesalahan {{error_count}}, peringatan {{warning_count}}',
  no_error: 'tidak ada kesalahan',
});
