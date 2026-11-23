import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  initialize: 'initialiseringsdokument',
  search_channels_files: 'søk etter Channel-filer',
  parse_channels: 'parse Channels',
  hand_fix_documentation: 'Reparer dokumenter manuelt',
  save_to_file: 'lagre til fil',
  validate: 'Bekreft dokumentet',
  help_summary: 'AsyncAPI 3-dokumentasjonsgenerator',
  has_error: '{{error_count}} feil, {{warning_count}} advarsler',
  no_error: 'ingen feil',
});
