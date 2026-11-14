import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  initialize: 'inicializācijas dokuments',
  search_routers_files: 'Meklēt maršrutēšanas failus',
  parse_routers: 'parsēt maršrutu',
  add_tag: 'Pievienot tagu',
  hand_fix_documentation: 'Labojiet dokumentus manuāli',
  optimize_parameter: 'Optimizācijas parametri',
  save_to_file: 'saglabāt failā',
  validate: 'Apstipriniet dokumentu',
  help_summary: 'OpenAPI v3 dokumentācijas ģenerators',
  has_error: '{{error_count}} kļūdas, {{warning_count}} brīdinājumi',
  no_error: 'nekādu kļūdu',
});
