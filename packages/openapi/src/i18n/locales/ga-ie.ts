import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ga-IE */
export default I18n.satisfies(zh).define({
  initialize: 'doiciméad tosaigh',
  search_routers_files: 'Cuardaigh comhaid ródaithe',
  parse_routers: 'bealach parsáil',
  add_tag: 'Cuir clib leis',
  hand_fix_documentation: 'Doiciméid a dheisiú de láimh',
  optimize_parameter: 'Paraiméadair leas iomlán a bhaint',
  save_to_file: 'shábháil i gcomhad',
  validate: 'Fíoraigh doiciméad',
  help_summary: 'Gineadóir doiciméadú OpenAPI v3',
  help_app_listen_tip:
    'Coinnigh new WebApp scartha ó app.listen (nó déan listen sa chomhad iontrála amháin) ionas nach dtosóidh import CLI an freastalaí mar fho-éifeacht',
  has_error: 'Earráidí {{error_count}}, rabhaidh {{warning_count}}',
  no_error: 'aon earráidí',
});
