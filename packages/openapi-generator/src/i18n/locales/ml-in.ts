import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ml-IN */
export default I18n.satisfies(zh).define({
  initialize: 'പ്രാരംഭ രേഖ',
  search_routers_files: 'റൂട്ടിംഗ് ഫയലുകൾ തിരയുക',
  parse_routers: 'പാഴ്സ് റൂട്ട്',
  add_tag: 'ടാഗ് ചേർക്കുക',
  hand_fix_documentation: 'പ്രമാണങ്ങൾ സ്വമേധയാ നന്നാക്കുക',
  optimize_parameter: 'ഒപ്റ്റിമൈസേഷൻ പാരാമീറ്ററുകൾ',
  save_to_file: 'ഫയലിലേക്ക് സംരക്ഷിക്കുക',
  validate: 'പ്രമാണം പരിശോധിക്കുക',
  help_summary: 'OpenAPI v3 ഡോക്യുമെൻ്റേഷൻ ജനറേറ്റർ',
  help_app_listen_tip:
    'new WebApp ഉം app.listen ഉം വേർതിരിക്കുക (അല്ലെങ്കിൽ എൻട്രി ഫയലിൽ മാത്രം listen ചെയ്യുക), CLI import പാർശ്വഫലമായി സെർവർ ആരംഭിക്കാതിരിക്കാൻ',
  has_error: '{{error_count}} പിശകുകൾ, {{warning_count}} മുന്നറിയിപ്പുകൾ',
  no_error: 'പിശകുകളില്ല',
});
