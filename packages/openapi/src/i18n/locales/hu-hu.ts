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
  help_app_listen_tip:
    'Válassza szét a new WebApp-et és az app.listen-t (vagy csak a belépési fájlban listen-eljen), hogy a CLI import ne indítsa el a szervert mellékhatásként',
  has_error: '{{error_count}} hibák, {{warning_count}} figyelmeztetések',
  no_error: 'nincsenek hibák',
});
