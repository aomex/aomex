import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  initialize: 'document de initializare',
  search_routers_files: 'Căutați fișiere de rutare',
  parse_routers: 'analiza traseului',
  add_tag: 'Adăugați etichetă',
  hand_fix_documentation: 'Repara documentele manual',
  optimize_parameter: 'Parametrii de optimizare',
  save_to_file: 'salvați în fișier',
  validate: 'Verificați documentul',
  help_summary: 'Generator de documentație OpenAPI v3',
  has_error: 'Erori {{error_count}}, avertismente {{warning_count}}',
  no_error: 'fara erori',
});
