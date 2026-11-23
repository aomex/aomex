import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  initialize: 'документ за иницијализација',
  search_channels_files: 'пребарај Channel датотеки',
  parse_channels: 'парсирај Channels',
  hand_fix_documentation: 'Рачно поправете ги документите',
  save_to_file: 'зачувај во датотека',
  validate: 'Потврдете го документот',
  help_summary: 'Генератор на документација AsyncAPI 3',
  has_error: '{{error_count}} грешки, {{warning_count}} предупредувања',
  no_error: 'нема грешки',
});
