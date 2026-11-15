import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bn-BD */
export default I18n.satisfies(zh).define({
  eject: 'নির্ধারিত কাজের তালিকা রপ্তানি করুন',
  start: 'একটি নির্ধারিত কাজ শুরু করুন',
  stop: 'নির্ধারিত কাজ বন্ধ করুন',
  stats: 'নির্ধারিত কার্য সম্পাদনের স্থিতি পরীক্ষা করুন',
  not_started: 'নির্ধারিত কাজটি শুরু হয়নি, পোর্ট: {{port}}',
  invalid_cron_time: 'অবৈধ ক্রন অভিব্যক্তি: {{time}}',
  invalid_port: 'অবৈধ সার্ভার পোর্ট: {{port}} (বৈধ পরিসর: 1-65535)',
});
