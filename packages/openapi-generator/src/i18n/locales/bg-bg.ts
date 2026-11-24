import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  initialize: 'документ за инициализация',
  search_routers_files: 'Търсете файлове за маршрутизиране',
  parse_routers: 'анализирайте маршрута',
  add_tag: 'Добавете етикет',
  hand_fix_documentation: 'Поправете документите ръчно',
  optimize_parameter: 'Параметри за оптимизация',
  save_to_file: 'запишете във файл',
  validate: 'Потвърдете документа',
  help_summary: 'OpenAPI v3 генератор на документация',
  help_app_listen_tip:
    'Разделете new WebApp и app.listen (или слушайте само във входния файл), за да не стартира CLI import сървъра като страничен ефект',
  has_error: '{{error_count}} грешки, {{warning_count}} предупреждения',
  no_error: 'няма грешки',
});
