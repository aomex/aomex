import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  initialize: 'dokument inicjujący',
  search_routers_files: 'Wyszukaj pliki routingu',
  parse_routers: 'przeanalizuj trasę',
  add_tag: 'Dodaj tag',
  hand_fix_documentation: 'Napraw dokumenty ręcznie',
  optimize_parameter: 'Parametry optymalizacji',
  save_to_file: 'zapisz do pliku',
  validate: 'Zweryfikuj dokument',
  help_summary: 'Generator dokumentacji OpenAPI v3',
  has_error: 'Błędy {{error_count}}, ostrzeżenia {{warning_count}}',
  no_error: 'żadnych błędów',
});
