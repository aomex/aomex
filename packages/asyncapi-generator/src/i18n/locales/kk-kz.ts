import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  initialize: 'инициализация құжаты',
  search_channels_files: 'Channel файлдарын іздеу',
  parse_channels: 'Channel талдау',
  hand_fix_documentation: 'Құжаттарды қолмен жөндеу',
  save_to_file: 'файлға сақтаңыз',
  validate: 'Құжатты растау',
  help_summary: 'AsyncAPI 3 құжаттама генераторы',
  has_error: '{{error_count}} қателері, {{warning_count}} ескертулері',
  no_error: 'қателер жоқ',
});
