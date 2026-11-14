import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  initialize: 'инициализация құжаты',
  search_routers_files: 'Маршруттау файлдарын іздеу',
  parse_routers: 'маршрутты талдау',
  add_tag: 'Тег қосыңыз',
  hand_fix_documentation: 'Құжаттарды қолмен жөндеу',
  optimize_parameter: 'Оңтайландыру параметрлері',
  save_to_file: 'файлға сақтаңыз',
  validate: 'Құжатты растау',
  help_summary: 'OpenAPI v3 құжаттама генераторы',
  has_error: '{{error_count}} қателері, {{warning_count}} ескертулері',
  no_error: 'қателер жоқ',
});
