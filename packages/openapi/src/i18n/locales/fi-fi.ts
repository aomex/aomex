import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  initialize: 'alustusasiakirja',
  search_routers_files: 'Etsi reititystiedostoja',
  parse_routers: 'jäsentää reittiä',
  add_tag: 'Lisää tunniste',
  hand_fix_documentation: 'Korjaa asiakirjat manuaalisesti',
  optimize_parameter: 'Optimointiparametrit',
  save_to_file: 'tallenna tiedostoon',
  validate: 'Tarkista asiakirja',
  help_summary: 'OpenAPI v3 -dokumentaatiogeneraattori',
  has_error: '{{error_count}}-virheet, {{warning_count}}-varoitukset',
  no_error: 'ei virheitä',
});
