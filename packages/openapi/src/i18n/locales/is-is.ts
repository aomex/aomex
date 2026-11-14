import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  initialize: 'upphafsskjal',
  search_routers_files: 'Leitaðu að leiðarskrám',
  parse_routers: 'flokka leið',
  add_tag: 'Bæta við merki',
  hand_fix_documentation: 'Gerðu skjöl handvirkt',
  optimize_parameter: 'Hagræðingarfæribreytur',
  save_to_file: 'vista í skrá',
  validate: 'Staðfestu skjal',
  help_summary: 'OpenAPI v3 skjöl rafall',
  has_error: '{{error_count}} villur, {{warning_count}} viðvaranir',
  no_error: 'engar villur',
});
