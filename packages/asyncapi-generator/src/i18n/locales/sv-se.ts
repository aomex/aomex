import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  initialize: 'initieringsdokument',
  search_channels_files: 'sök Channel-filer',
  parse_channels: 'parsa Channels',
  hand_fix_documentation: 'Reparera dokument manuellt',
  save_to_file: 'spara till fil',
  validate: 'Verifiera dokumentet',
  help_summary: 'AsyncAPI 3-dokumentationsgenerator',
  has_error: '{{error_count}}-fel, {{warning_count}}-varningar',
  no_error: 'inga fel',
});
