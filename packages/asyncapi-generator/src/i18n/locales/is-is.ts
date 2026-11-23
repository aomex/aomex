import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  initialize: 'upphafsskjal',
  search_channels_files: 'leita að Channel skrám',
  parse_channels: 'þátta Channels',
  hand_fix_documentation: 'Gerðu skjöl handvirkt',
  save_to_file: 'vista í skrá',
  validate: 'Staðfestu skjal',
  help_summary: 'AsyncAPI 3 skjalagerðarforrit',
  has_error: '{{error_count}} villur, {{warning_count}} viðvaranir',
  no_error: 'engar villur',
});
