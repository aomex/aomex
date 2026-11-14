import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ta-IN */
export default I18n.satisfies(zh).define({
  initialize: 'துவக்க ஆவணம்',
  search_routers_files: 'ரூட்டிங் கோப்புகளைத் தேடுங்கள்',
  parse_routers: 'பாகுபடுத்தும் பாதை',
  add_tag: 'குறிச்சொல்லைச் சேர்க்கவும்',
  hand_fix_documentation: 'ஆவணங்களை கைமுறையாக சரிசெய்தல்',
  optimize_parameter: 'மேம்படுத்தல் அளவுருக்கள்',
  save_to_file: 'கோப்பில் சேமிக்கவும்',
  validate: 'ஆவணத்தை சரிபார்க்கவும்',
  help_summary: 'OpenAPI v3 ஆவணப்படுத்தல் ஜெனரேட்டர்',
  has_error: '{{error_count}} பிழைகள், {{warning_count}} எச்சரிக்கைகள்',
  no_error: 'பிழைகள் இல்லை',
});
