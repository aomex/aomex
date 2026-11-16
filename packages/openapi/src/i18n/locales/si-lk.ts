import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** si-LK */
export default I18n.satisfies(zh).define({
  initialize: 'ආරම්භක ලේඛනය',
  search_routers_files: 'මාර්ගගත ගොනු සොයන්න',
  parse_routers: 'විග්‍රහ කිරීමේ මාර්ගය',
  add_tag: 'ටැගය එක් කරන්න',
  hand_fix_documentation: 'ලේඛන අතින් අළුත්වැඩියා කරන්න',
  optimize_parameter: 'ප්රශස්තකරණ පරාමිතීන්',
  save_to_file: 'ගොනුවට සුරකින්න',
  validate: 'ලේඛනය තහවුරු කරන්න',
  help_summary: 'OpenAPI v3 ලේඛන උත්පාදක යන්ත්රය',
  help_app_listen_tip:
    'app යැවීමේදී new WebApp සහ app.listen වෙන් කරන්න (නැතහොත් ප්‍රවේශ ගොනුවේ පමණක් listen කරන්න), CLI import අතුරු ඵලයක් ලෙස සර්වරය ආරම්භ නොකරන ලෙස',
  has_error: '{{error_count}} දෝෂ, {{warning_count}} අනතුරු ඇඟවීම්',
  no_error: 'දෝෂ නොමැත',
});
