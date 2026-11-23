import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  initialize: 'документ ініціалізації',
  search_channels_files: 'пошук файлів Channel',
  parse_channels: 'розбір Channel',
  hand_fix_documentation: 'Ремонт документів вручну',
  save_to_file: 'зберегти у файл',
  validate: 'Підтвердити документ',
  help_summary: 'Генератор документації AsyncAPI 3',
  has_error: 'Помилки {{error_count}}, попередження {{warning_count}}',
  no_error: 'немає помилок',
});
