import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  initialize: 'documento de inicialización',
  search_channels_files: 'buscar ficheiros Channel',
  parse_channels: 'analizar Channels',
  hand_fix_documentation: 'Repara documentos manualmente',
  save_to_file: 'gardar no ficheiro',
  validate: 'Verificar o documento',
  help_summary: 'Xerador de documentación AsyncAPI 3',
  has_error: 'Erros {{error_count}}, avisos {{warning_count}}',
  no_error: 'sen erros',
});
