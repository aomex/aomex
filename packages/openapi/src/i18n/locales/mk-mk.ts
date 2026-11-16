import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  initialize: 'документ за иницијализација',
  search_routers_files: 'Пребарувајте датотеки за насочување',
  parse_routers: 'анализира пат',
  add_tag: 'Додадете ознака',
  hand_fix_documentation: 'Рачно поправете ги документите',
  optimize_parameter: 'Параметри за оптимизација',
  save_to_file: 'зачувај во датотека',
  validate: 'Потврдете го документот',
  help_summary: 'Генератор на документација OpenAPI v3',
  help_app_listen_tip:
    'Одделете го new WebApp од app.listen (или слушајте само во влезната датотека) за CLI import да не го стартува серверот како страничен ефект',
  has_error: '{{error_count}} грешки, {{warning_count}} предупредувања',
  no_error: 'нема грешки',
});
