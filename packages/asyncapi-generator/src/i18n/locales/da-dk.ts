import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  initialize: 'initialiseringsdokument',
  search_channels_files: 'søg efter Channel-filer',
  parse_channels: 'parse Channels',
  hand_fix_documentation: 'Reparer dokumenter manuelt',
  save_to_file: 'gem til fil',
  validate: 'Bekræft dokumentet',
  help_summary: 'AsyncAPI 3-dokumentationsgenerator',
  has_error: '{{error_count}} fejl, {{warning_count}} advarsler',
  no_error: 'ingen fejl',
});
