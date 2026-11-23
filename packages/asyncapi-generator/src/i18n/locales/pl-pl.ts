import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  initialize: 'dokument inicjujący',
  search_channels_files: 'wyszukaj pliki Channel',
  parse_channels: 'parsuj Channels',
  hand_fix_documentation: 'Napraw dokumenty ręcznie',
  save_to_file: 'zapisz do pliku',
  validate: 'Zweryfikuj dokument',
  help_summary: 'Generator dokumentacji AsyncAPI 3',
  has_error: 'Błędy {{error_count}}, ostrzeżenia {{warning_count}}',
  no_error: 'żadnych błędów',
});
