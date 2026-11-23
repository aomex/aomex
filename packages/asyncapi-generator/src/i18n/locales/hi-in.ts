import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  initialize: 'आरंभीकरण दस्तावेज़',
  search_channels_files: 'Channel फ़ाइलें खोजें',
  parse_channels: 'Channel पार्स करें',
  hand_fix_documentation: 'दस्तावेज़ों को मैन्युअल रूप से सुधारें',
  save_to_file: 'फ़ाइल में सहेजें',
  validate: 'दस्तावेज़ सत्यापित करें',
  help_summary: 'AsyncAPI 3 दस्तावेज़ जनरेटर',
  has_error: '{{error_count}} त्रुटियाँ, {{warning_count}} चेतावनियाँ',
  no_error: 'कोई त्रुटि नहीं',
});
