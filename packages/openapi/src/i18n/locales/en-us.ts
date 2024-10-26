import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  initialize: 'initialize document',
  search_routers_files: 'search web routers files',
  parse_routers: 'parse routers',
  add_tag: 'append tags',
  hand_fix_documentation: 'fix documentation by manual',
  optimize_parameter: 'optimize parameters',
  save_to_file: 'save to file',
  validate: 'validate document',
  help_summary: 'openapi v3 documentation generator',
  has_error: '{{error_count}} errors, {{warning_count}} warnings',
  no_error: 'No errors',
});
