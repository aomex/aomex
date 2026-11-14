import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  initialize: 'Initialisierungsdokument',
  search_routers_files: 'Durchsuchen Sie Routing-Dateien',
  parse_routers: 'Parse-Route',
  add_tag: 'Tag hinzufügen',
  hand_fix_documentation: 'Dokumente manuell reparieren',
  optimize_parameter: 'Optimierungsparameter',
  save_to_file: 'in Datei speichern',
  validate: 'Dokument überprüfen',
  help_summary: 'OpenAPI v3-Dokumentationsgenerator',
  has_error: '{{error_count}}-Fehler, {{warning_count}}-Warnungen',
  no_error: 'keine Fehler',
});
