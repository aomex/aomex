import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  initialize: 'дакумент ініцыялізацыі',
  search_routers_files: 'Пошук файлаў маршрутызацыі',
  parse_routers: 'разабраць маршрут',
  add_tag: 'Дадаць тэг',
  hand_fix_documentation: 'Рамантаваць дакументы ўручную',
  optimize_parameter: 'Параметры аптымізацыі',
  save_to_file: 'захаваць у файл',
  validate: 'Праверка дакумента',
  help_summary: 'Генератар дакументацыі OpenAPI v3',
  has_error: 'Памылкі {{error_count}}, папярэджанні {{warning_count}}',
  no_error: 'ніякіх памылак',
});
