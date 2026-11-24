import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  initialize: 'inicializacijski dokument',
  search_routers_files: 'Iskanje usmerjevalnih datotek',
  parse_routers: 'razčleniti pot',
  add_tag: 'Dodaj oznako',
  hand_fix_documentation: 'Ročno popravite dokumente',
  optimize_parameter: 'Optimizacijski parametri',
  save_to_file: 'shrani v datoteko',
  validate: 'Preveri dokument',
  help_summary: 'Generator dokumentacije OpenAPI v3',
  help_app_listen_tip:
    'Ločite new WebApp in app.listen (ali poslušajte samo v vstopni datoteki), da CLI uvoz ne zažene strežnika kot stranski učinek',
  has_error: '{{error_count}} napake, {{warning_count}} opozorila',
  no_error: 'brez napak',
});
