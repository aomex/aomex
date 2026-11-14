import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  eject: 'निर्धारित कार्य सूची निर्यात करें',
  start: 'एक निर्धारित कार्य प्रारंभ करें',
  stop: 'निर्धारित कार्य रोकें',
  stats: 'निर्धारित कार्यों की निष्पादन स्थिति की जाँच करें',
  not_started: 'निर्धारित कार्य प्रारंभ नहीं हुआ है, पोर्ट: {{port}}',
  invalid_cron_time: 'अमान्य क्रॉन अभिव्यक्ति: {{time}}',
});
