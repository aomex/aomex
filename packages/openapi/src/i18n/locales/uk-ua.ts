import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  initialize: 'документ ініціалізації',
  search_routers_files: 'Пошук файлів маршрутизації',
  parse_routers: 'розібрати маршрут',
  add_tag: 'Додати тег',
  hand_fix_documentation: 'Ремонт документів вручну',
  optimize_parameter: 'Параметри оптимізації',
  save_to_file: 'зберегти у файл',
  validate: 'Підтвердити документ',
  help_summary: 'Генератор документації OpenAPI v3',
  has_error: 'Помилки {{error_count}}, попередження {{warning_count}}',
  no_error: 'немає помилок',
});
