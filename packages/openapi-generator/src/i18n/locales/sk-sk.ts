import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  initialize: 'inicializačný dokument',
  search_routers_files: 'Vyhľadajte smerovacie súbory',
  parse_routers: 'analyzovať trasu',
  add_tag: 'Pridať značku',
  hand_fix_documentation: 'Opravte dokumenty ručne',
  optimize_parameter: 'Parametre optimalizácie',
  save_to_file: 'uložiť do súboru',
  validate: 'Overte dokument',
  help_summary: 'Generátor dokumentácie OpenAPI v3',
  help_app_listen_tip:
    'Oddelte new WebApp a app.listen (alebo počúvajte len vo vstupnom súbore), aby CLI import nespúšťal server ako vedľajší efekt',
  has_error: 'Chyby {{error_count}}, upozornenia {{warning_count}}',
  no_error: 'žiadne chyby',
});
