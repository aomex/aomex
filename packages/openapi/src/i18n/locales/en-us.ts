import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  initialize: 'initialize document',
  search_routers_files: 'search web routers files',
  parse_routers: 'parse routers',
  add_tag: 'Add tags',
  hand_fix_documentation: 'fix documentation by manual',
  optimize_parameter: 'optimize parameters',
  save_to_file: 'save to file',
  validate: 'validate document',
  help_summary: 'OpenAPI v3 documentation generator',
  help_app_listen_tip:
    'When passing app, keep new WebApp separate from app.listen (or listen only in the entry file) so CLI imports do not start the server as a side effect',
  has_error: '{{error_count}} errors, {{warning_count}} warnings',
  no_error: 'No errors',
});
