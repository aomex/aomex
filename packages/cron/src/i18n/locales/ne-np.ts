import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  eject: 'निर्धारित कार्य सूची निर्यात गर्नुहोस्',
  start: 'निर्धारित कार्य सुरु गर्नुहोस्',
  stop: 'निर्धारित कार्यहरू रोक्नुहोस्',
  stats: 'निर्धारित कार्यहरूको कार्यान्वयन स्थिति जाँच गर्नुहोस्',
  not_started: 'निर्धारित कार्य सुरु भएको छैन, पोर्ट: {{port}}',
  invalid_cron_time: 'अवैध क्रोन अभिव्यक्ति: {{time}}',
  invalid_port: 'अमान्य सर्भर पोर्ट: {{port}} (मान्य दायरा: 1-65535)',
});
