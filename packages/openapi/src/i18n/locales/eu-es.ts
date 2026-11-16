import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** eu-ES */
export default I18n.satisfies(zh).define({
  initialize: 'hasierako dokumentua',
  search_routers_files: 'Bilatu bideratze-fitxategiak',
  parse_routers: 'parse ibilbidea',
  add_tag: 'Gehitu etiketa',
  hand_fix_documentation: 'Dokumentuak eskuz konpondu',
  optimize_parameter: 'Optimizazio-parametroak',
  save_to_file: 'gorde fitxategian',
  validate: 'Egiaztatu dokumentua',
  help_summary: 'OpenAPI v3 dokumentazio-sorgailua',
  help_app_listen_tip:
    'app pasatzean, bereizi new WebApp eta app.listen (edo entzun sarrera-fitxategian soilik), CLI inportazioak zerbitzaria albo-ondorio gisa abiaraz ez dezan',
  has_error: '{{error_count}} akatsak, {{warning_count}} abisuak',
  no_error: 'akatsik ez',
});
