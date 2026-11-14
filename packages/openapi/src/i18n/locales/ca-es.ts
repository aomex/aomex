import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  initialize: "document d'inicialització",
  search_routers_files: "Cerca fitxers d'encaminament",
  parse_routers: 'analitzar la ruta',
  add_tag: 'Afegeix una etiqueta',
  hand_fix_documentation: 'Repareu documents manualment',
  optimize_parameter: "Paràmetres d'optimització",
  save_to_file: 'desar al fitxer',
  validate: 'Verificar el document',
  help_summary: 'Generador de documentació OpenAPI v3',
  has_error: 'Errors {{error_count}}, avisos {{warning_count}}',
  no_error: 'sense errors',
});
