import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bn-BD */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub বন্ধ, সম্প্রচার করা যাচ্ছে না',
  resync_failed: 'Redis সাবস্ক্রিপশন পুনরুদ্ধার করা যায়নি',
  sync_room_failed: 'ঘরের সাবস্ক্রিপশন মেলানো যায়নি: {{room}}',
  bus_fanout_failed: 'বাস ফ্যানআউট ব্যর্থ হয়েছে',
  destroy_ready_failed: 'বন্ধ করার সময় Hub আরম্ভের জন্য অপেক্ষা ব্যর্থ হয়েছে',
});
