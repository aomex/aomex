import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  initialize: 'initialiseringsdokument',
  search_routers_files: 'Søk i rutingfiler',
  parse_routers: 'analysere rute',
  add_tag: 'Legg til tag',
  hand_fix_documentation: 'Reparer dokumenter manuelt',
  optimize_parameter: 'Optimaliseringsparametere',
  save_to_file: 'lagre til fil',
  validate: 'Bekreft dokumentet',
  help_summary: 'OpenAPI v3 dokumentasjonsgenerator',
  has_error: '{{error_count}} feil, {{warning_count}} advarsler',
  no_error: 'ingen feil',
});
