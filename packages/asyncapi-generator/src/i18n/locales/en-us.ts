import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  initialize: 'initialize document',
  search_channels_files: 'search Channel files',
  parse_channels: 'parse Channels',
  hand_fix_documentation: 'fix documentation by manual',
  save_to_file: 'save to file',
  validate: 'validate document',
  help_summary: 'AsyncAPI 3 documentation generator',
  has_error: '{{error_count}} errors, {{warning_count}} warnings',
  no_error: 'No errors',
});
