import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tk-TM */
export default I18n.satisfies(zh).define({
  initialize: 'başlangyç resminamasy',
  search_routers_files: 'Marşrut faýllaryny gözläň',
  parse_routers: 'ugur',
  add_tag: 'Bellik goşuň',
  hand_fix_documentation: 'Resminamalary el bilen bejermek',
  optimize_parameter: 'Optimizasiýa parametrleri',
  save_to_file: 'faýla ýazdyryň',
  validate: 'Resminamany barlaň',
  help_summary: 'OpenAPI v3 resminama generatory',
  help_app_listen_tip:
    'app geçirilende new WebApp bilen app.listen-i aýryň (ýa-da diňe giriş faýlynda listen ediň), CLI importy serweri goşmaça täsir hökmünde işe goýmazlygy üçin',
  has_error: '{{error_count}} ýalňyşlyklary, {{warning_count}} duýduryşlary',
  no_error: 'ýalňyşlyk ýok',
});
