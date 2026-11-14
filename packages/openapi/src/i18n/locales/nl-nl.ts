import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  initialize: 'initialisatiedocument',
  search_routers_files: 'Zoek routeringsbestanden',
  parse_routers: 'parseer route',
  add_tag: 'Label toevoegen',
  hand_fix_documentation: 'Documenten handmatig repareren',
  optimize_parameter: 'Optimalisatieparameters',
  save_to_file: 'opslaan in bestand',
  validate: 'Document verifiëren',
  help_summary: 'OpenAPI v3-documentatiegenerator',
  has_error: '{{error_count}}-fouten, {{warning_count}}-waarschuwingen',
  no_error: 'geen fouten',
});
