import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  initialize: 'inicializacijski dokument',
  search_channels_files: 'išči Channel datoteke',
  parse_channels: 'razčleni Channels',
  hand_fix_documentation: 'Ročno popravite dokumente',
  save_to_file: 'shrani v datoteko',
  validate: 'Preveri dokument',
  help_summary: 'Generator dokumentacije AsyncAPI 3',
  has_error: '{{error_count}} napake, {{warning_count}} opozorila',
  no_error: 'brez napak',
});
