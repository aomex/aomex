import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  initialize: 'документ инициализации',
  search_routers_files: 'Поиск файлов маршрутизации',
  parse_routers: 'анализировать маршрут',
  add_tag: 'Добавить тег',
  hand_fix_documentation: 'Восстановить документы вручную',
  optimize_parameter: 'Параметры оптимизации',
  save_to_file: 'сохранить в файл',
  validate: 'Проверить документ',
  help_summary: 'Генератор документации OpenAPI v3',
  help_app_listen_tip:
    'При передаче app разделите new WebApp и app.listen (или слушайте только в точке входа), чтобы CLI import не запускал сервер как побочный эффект',
  has_error: 'Ошибки {{error_count}}, предупреждения {{warning_count}}',
  no_error: 'нет ошибок',
});
