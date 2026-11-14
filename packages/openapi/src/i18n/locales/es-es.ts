import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  initialize: 'documento de inicialización',
  search_routers_files: 'Buscar archivos de enrutamiento',
  parse_routers: 'ruta de análisis',
  add_tag: 'Agregar etiqueta',
  hand_fix_documentation: 'Reparar documentos manualmente',
  optimize_parameter: 'Parámetros de optimización',
  save_to_file: 'guardar en el archivo',
  validate: 'Verificar documento',
  help_summary: 'Generador de documentación OpenAPI v3',
  has_error: 'Errores {{error_count}}, advertencias {{warning_count}}',
  no_error: 'sin errores',
});
