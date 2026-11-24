import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  initialize: 'initieringsdokument',
  search_routers_files: 'Sök routingfiler',
  parse_routers: 'analysera rutt',
  add_tag: 'Lägg till tagg',
  hand_fix_documentation: 'Reparera dokument manuellt',
  optimize_parameter: 'Optimeringsparametrar',
  save_to_file: 'spara till fil',
  validate: 'Verifiera dokumentet',
  help_summary: 'OpenAPI v3 dokumentationsgenerator',
  help_app_listen_tip:
    'Håll new WebApp åtskild från app.listen (eller lyssna bara i startfilen) så att CLI-import inte startar servern som bieffekt',
  has_error: '{{error_count}}-fel, {{warning_count}}-varningar',
  no_error: 'inga fel',
});
