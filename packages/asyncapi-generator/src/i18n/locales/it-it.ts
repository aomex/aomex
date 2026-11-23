import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  initialize: 'documento di inizializzazione',
  search_channels_files: 'cerca file Channel',
  parse_channels: 'analizza Channels',
  hand_fix_documentation: 'Riparare i documenti manualmente',
  save_to_file: 'salvare su file',
  validate: 'Verifica documento',
  help_summary: 'Generatore di documentazione AsyncAPI 3',
  has_error: 'Errori {{error_count}}, avvisi {{warning_count}}',
  no_error: 'nessun errore',
});
