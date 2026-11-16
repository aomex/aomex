import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  initialize: 'inicijavimo dokumentas',
  search_routers_files: 'Ieškoti maršruto failų',
  parse_routers: 'analizuoti maršrutą',
  add_tag: 'Pridėti žymą',
  hand_fix_documentation: 'Taisykite dokumentus rankiniu būdu',
  optimize_parameter: 'Optimizavimo parametrai',
  save_to_file: 'išsaugoti faile',
  validate: 'Patvirtinti dokumentą',
  help_summary: 'OpenAPI v3 dokumentų generatorius',
  help_app_listen_tip:
    'Perduodami app, atskirkite new WebApp ir app.listen (arba klausykite tik įėjimo faile), kad CLI importas nepaleistų serverio kaip šalutinio poveikio',
  has_error: '{{error_count}} klaidos, {{warning_count}} įspėjimai',
  no_error: 'jokių klaidų',
});
