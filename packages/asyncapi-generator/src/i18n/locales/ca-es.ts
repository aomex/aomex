import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  initialize: "document d'inicialització",
  search_channels_files: 'cerca fitxers Channel',
  parse_channels: 'analitza Channels',
  hand_fix_documentation: 'Repareu documents manualment',
  save_to_file: 'desar al fitxer',
  validate: 'Verificar el document',
  help_summary: 'Generador de documentació AsyncAPI 3',
  has_error: 'Errors {{error_count}}, avisos {{warning_count}}',
  no_error: 'sense errors',
});
