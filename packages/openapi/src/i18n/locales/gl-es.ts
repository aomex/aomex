import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  initialize: 'documento de inicialización',
  search_routers_files: 'Busca ficheiros de enrutamento',
  parse_routers: 'analizar ruta',
  add_tag: 'Engadir etiqueta',
  hand_fix_documentation: 'Repara documentos manualmente',
  optimize_parameter: 'Parámetros de optimización',
  save_to_file: 'gardar no ficheiro',
  validate: 'Verificar o documento',
  help_summary: 'Xerador de documentación OpenAPI v3',
  has_error: 'Erros {{error_count}}, avisos {{warning_count}}',
  no_error: 'sen erros',
});
