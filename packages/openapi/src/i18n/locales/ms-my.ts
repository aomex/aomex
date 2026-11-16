import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ms-MY */
export default I18n.satisfies(zh).define({
  initialize: 'dokumen permulaan',
  search_routers_files: 'Cari fail penghalaan',
  parse_routers: 'menghurai laluan',
  add_tag: 'Tambah tag',
  hand_fix_documentation: 'Membaiki dokumen secara manual',
  optimize_parameter: 'Parameter pengoptimuman',
  save_to_file: 'simpan ke fail',
  validate: 'Sahkan dokumen',
  help_summary: 'Penjana dokumentasi OpenAPI v3',
  help_app_listen_tip:
    'Asingkan new WebApp daripada app.listen (atau listen hanya dalam fail entri) supaya import CLI tidak memulakan pelayan sebagai kesan sampingan',
  has_error: 'Ralat {{error_count}}, amaran {{warning_count}}',
  no_error: 'tiada ralat',
});
