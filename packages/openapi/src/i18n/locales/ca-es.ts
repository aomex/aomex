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
  help_app_listen_tip:
    'En passar app, separeu new WebApp d’app.listen (o feu listen només al fitxer d’entrada) per evitar que l’import del CLI iniciï el servidor com a efecte secundari',
  has_error: 'Errors {{error_count}}, avisos {{warning_count}}',
  no_error: 'sense errors',
});
