import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  initialize: 'inicializační dokument',
  search_channels_files: 'hledat soubory Channel',
  parse_channels: 'parsovat Channels',
  hand_fix_documentation: 'Opravte dokumenty ručně',
  save_to_file: 'uložit do souboru',
  validate: 'Ověřte dokument',
  help_summary: 'Generátor dokumentace AsyncAPI 3',
  has_error: 'Chyby {{error_count}}, varování {{warning_count}}',
  no_error: 'žádné chyby',
});
