import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  initialize: 'inicializálási dokumentum',
  search_routers_files: 'Útválasztó fájlok keresése',
  parse_routers: 'útvonal elemzése',
  add_tag: 'Címke hozzáadása',
  hand_fix_documentation: 'A dokumentumok manuális javítása',
  optimize_parameter: 'Optimalizálási paraméterek',
  save_to_file: 'fájlba menteni',
  validate: 'Igazolja a dokumentumot',
  help_summary: 'OpenAPI v3 dokumentáció generátor',
  has_error: '{{error_count}} hibák, {{warning_count}} figyelmeztetések',
  no_error: 'nincsenek hibák',
});
