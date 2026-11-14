import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** az-AZ */
export default I18n.satisfies(zh).define({
  initialize: 'başlanğıc sənədi',
  search_routers_files: 'Yönləndirmə fayllarını axtarın',
  parse_routers: 'marşrutu təhlil edin',
  add_tag: 'Etiket əlavə edin',
  hand_fix_documentation: 'Sənədləri əl ilə təmir edin',
  optimize_parameter: 'Optimallaşdırma parametrləri',
  save_to_file: 'fayla qeyd edin',
  validate: 'Sənədi yoxlayın',
  help_summary: 'OpenAPI v3 sənədləşdirmə generatoru',
  has_error: '{{error_count}} səhvləri, {{warning_count}} xəbərdarlıqları',
  no_error: 'səhvlər yoxdur',
});
