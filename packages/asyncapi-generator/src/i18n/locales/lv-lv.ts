import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  initialize: 'inicializācijas dokuments',
  search_channels_files: 'meklēt Channel failus',
  parse_channels: 'analizēt Channels',
  hand_fix_documentation: 'Labojiet dokumentus manuāli',
  save_to_file: 'saglabāt failā',
  validate: 'Apstipriniet dokumentu',
  help_summary: 'AsyncAPI 3 dokumentācijas ģenerators',
  has_error: '{{error_count}} kļūdas, {{warning_count}} brīdinājumi',
  no_error: 'nekādu kļūdu',
});
