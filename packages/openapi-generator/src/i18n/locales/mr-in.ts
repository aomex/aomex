import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mr-IN */
export default I18n.satisfies(zh).define({
  initialize: 'आरंभ दस्तऐवज',
  search_routers_files: 'राउटिंग फाइल्स शोधा',
  parse_routers: 'मार्ग पार्स करा',
  add_tag: 'टॅग जोडा',
  hand_fix_documentation: 'कागदपत्रे स्वहस्ते दुरुस्त करा',
  optimize_parameter: 'ऑप्टिमायझेशन पॅरामीटर्स',
  save_to_file: 'फाइलमध्ये सेव्ह करा',
  validate: 'दस्तऐवज सत्यापित करा',
  help_summary: 'OpenAPI v3 दस्तऐवजीकरण जनरेटर',
  help_app_listen_tip:
    'new WebApp आणि app.listen वेगळे ठेवा (किंवा फक्त एंट्री फाइलमध्ये listen करा), जेणेकरून CLI import साइड इफेक्ट म्हणून सर्व्हर सुरू करणार नाही',
  has_error: '{{error_count}} त्रुटी, {{warning_count}} चेतावणी',
  no_error: 'कोणत्याही त्रुटी नाहीत',
});
