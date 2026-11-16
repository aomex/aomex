import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  initialize: 'initialiseringsdokument',
  search_routers_files: 'Søg i routingfiler',
  parse_routers: 'analysere rute',
  add_tag: 'Tilføj tag',
  hand_fix_documentation: 'Reparer dokumenter manuelt',
  optimize_parameter: 'Optimeringsparametre',
  save_to_file: 'gem til fil',
  validate: 'Bekræft dokumentet',
  help_summary: 'OpenAPI v3 dokumentationsgenerator',
  help_app_listen_tip:
    'Når du sender app, skal du adskille new WebApp og app.listen (eller kun lytte i indgangsfilen), så CLI-import ikke starter serveren som bivirkning',
  has_error: '{{error_count}} fejl, {{warning_count}} advarsler',
  no_error: 'ingen fejl',
});
