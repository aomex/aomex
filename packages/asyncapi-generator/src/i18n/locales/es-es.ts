import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  initialize: 'documento de inicialización',
  search_channels_files: 'buscar archivos Channel',
  parse_channels: 'analizar Channels',
  hand_fix_documentation: 'Reparar documentos manualmente',
  save_to_file: 'guardar en el archivo',
  validate: 'Verificar documento',
  help_summary: 'Generador de documentación AsyncAPI 3',
  has_error: 'Errores {{error_count}}, advertencias {{warning_count}}',
  no_error: 'sin errores',
});
