import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  initialize: 'inicijalizacijski dokument',
  search_routers_files: 'Pretraživanje datoteka za usmjeravanje',
  parse_routers: 'analizirati rutu',
  add_tag: 'Dodaj oznaku',
  hand_fix_documentation: 'Ručno popravite dokumente',
  optimize_parameter: 'Parametri optimizacije',
  save_to_file: 'spremiti u datoteku',
  validate: 'Ovjeri dokument',
  help_summary: 'OpenAPI v3 generator dokumentacije',
  help_app_listen_tip:
    'Odvojite new WebApp i app.listen (ili slušajte samo u ulaznoj datoteci) kako CLI import ne bi pokrenuo poslužitelj kao nuspojavu',
  has_error: '{{error_count}} pogreške, {{warning_count}} upozorenja',
  no_error: 'nema grešaka',
});
