import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  initialize: 'आरंभीकरण दस्तावेज़',
  search_routers_files: 'रूटिंग फ़ाइलें खोजें',
  parse_routers: 'पार्स मार्ग',
  add_tag: 'टैग जोड़ें',
  hand_fix_documentation: 'दस्तावेज़ों को मैन्युअल रूप से सुधारें',
  optimize_parameter: 'अनुकूलन पैरामीटर',
  save_to_file: 'फ़ाइल में सहेजें',
  validate: 'दस्तावेज़ सत्यापित करें',
  help_summary: 'OpenAPI v3 दस्तावेज़ जनरेटर',
  has_error: '{{error_count}} त्रुटियाँ, {{warning_count}} चेतावनियाँ',
  no_error: 'कोई त्रुटि नहीं',
});
