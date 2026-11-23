import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  initialize: 'document de initializare',
  search_channels_files: 'caută fișiere Channel',
  parse_channels: 'analizează Channels',
  hand_fix_documentation: 'Repara documentele manual',
  save_to_file: 'salvați în fișier',
  validate: 'Verificați documentul',
  help_summary: 'Generator de documentație AsyncAPI 3',
  has_error: 'Erori {{error_count}}, avertismente {{warning_count}}',
  no_error: 'fara erori',
});
