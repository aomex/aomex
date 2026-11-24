import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  initialize: 'inicializační dokument',
  search_routers_files: 'Prohledejte soubory směrování',
  parse_routers: 'rozebrat trasu',
  add_tag: 'Přidat značku',
  hand_fix_documentation: 'Opravte dokumenty ručně',
  optimize_parameter: 'Optimalizační parametry',
  save_to_file: 'uložit do souboru',
  validate: 'Ověřte dokument',
  help_summary: 'Generátor dokumentace OpenAPI v3',
  help_app_listen_tip:
    'Oddělte new WebApp a app.listen (nebo naslouchejte jen ve vstupním souboru), aby CLI import nespouštěl server jako vedlejší efekt',
  has_error: 'Chyby {{error_count}}, varování {{warning_count}}',
  no_error: 'žádné chyby',
});
