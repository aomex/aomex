import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  initialize: 'inicializačný dokument',
  search_channels_files: 'hľadať súbory Channel',
  parse_channels: 'parsovať Channels',
  hand_fix_documentation: 'Opravte dokumenty ručne',
  save_to_file: 'uložiť do súboru',
  validate: 'Overte dokument',
  help_summary: 'Generátor dokumentácie AsyncAPI 3',
  has_error: 'Chyby {{error_count}}, upozornenia {{warning_count}}',
  no_error: 'žiadne chyby',
});
