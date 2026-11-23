import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  initialize: 'документ за инициализация',
  search_channels_files: 'търсене на Channel файлове',
  parse_channels: 'анализ на Channel',
  hand_fix_documentation: 'Поправете документите ръчно',
  save_to_file: 'запишете във файл',
  validate: 'Потвърдете документа',
  help_summary: 'Генератор на документация AsyncAPI 3',
  has_error: '{{error_count}} грешки, {{warning_count}} предупреждения',
  no_error: 'няма грешки',
});
