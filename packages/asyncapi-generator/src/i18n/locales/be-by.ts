import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  initialize: 'дакумент ініцыялізацыі',
  search_channels_files: 'пошук файлаў Channel',
  parse_channels: 'разбор Channel',
  hand_fix_documentation: 'Рамантаваць дакументы ўручную',
  save_to_file: 'захаваць у файл',
  validate: 'Праверка дакумента',
  help_summary: 'Генератар дакументацыі AsyncAPI 3',
  has_error: 'Памылкі {{error_count}}, папярэджанні {{warning_count}}',
  no_error: 'ніякіх памылак',
});
