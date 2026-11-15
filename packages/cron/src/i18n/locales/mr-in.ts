import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mr-IN */
export default I18n.satisfies(zh).define({
  eject: 'नियोजित कार्य सूची निर्यात करा',
  start: 'नियोजित कार्य सुरू करा',
  stop: 'नियोजित कामे थांबवा',
  stats: 'नियोजित कार्यांची अंमलबजावणी स्थिती तपासा',
  not_started: 'शेड्यूल केलेले कार्य सुरू झाले नाही, पोर्ट: {{port}}',
  invalid_cron_time: 'अवैध क्रॉन अभिव्यक्ती: {{time}}',
  invalid_port: 'अवैध सर्व्हर पोर्ट: {{port}} (वैध श्रेणी: 1-65535)',
});
