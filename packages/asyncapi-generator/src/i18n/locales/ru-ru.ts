import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  initialize: 'документ инициализации',
  search_channels_files: 'поиск файлов Channel',
  parse_channels: 'разбор Channel',
  hand_fix_documentation: 'Восстановить документы вручную',
  save_to_file: 'сохранить в файл',
  validate: 'Проверить документ',
  help_summary: 'Генератор документации AsyncAPI 3',
  has_error: 'Ошибки {{error_count}}, предупреждения {{warning_count}}',
  no_error: 'нет ошибок',
});
