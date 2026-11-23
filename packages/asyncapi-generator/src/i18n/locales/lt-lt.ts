import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  initialize: 'inicijavimo dokumentas',
  search_channels_files: 'ieškoti Channel failų',
  parse_channels: 'analizuoti Channels',
  hand_fix_documentation: 'Taisykite dokumentus rankiniu būdu',
  save_to_file: 'išsaugoti faile',
  validate: 'Patvirtinti dokumentą',
  help_summary: 'AsyncAPI 3 dokumentacijos generatorius',
  has_error: '{{error_count}} klaidos, {{warning_count}} įspėjimai',
  no_error: 'jokių klaidų',
});
