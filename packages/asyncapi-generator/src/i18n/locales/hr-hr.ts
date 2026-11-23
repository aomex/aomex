import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  initialize: 'inicijalizacijski dokument',
  search_channels_files: 'pretraži Channel datoteke',
  parse_channels: 'parsiranje Channels',
  hand_fix_documentation: 'Ručno popravite dokumente',
  save_to_file: 'spremiti u datoteku',
  validate: 'Ovjeri dokument',
  help_summary: 'Generator dokumentacije AsyncAPI 3',
  has_error: '{{error_count}} pogreške, {{warning_count}} upozorenja',
  no_error: 'nema grešaka',
});
