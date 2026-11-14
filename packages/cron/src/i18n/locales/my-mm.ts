import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  eject: 'စီစဉ်ထားသော အလုပ်စာရင်းကို ထုတ်ယူပါ။',
  start: 'စီစဉ်ထားသော အလုပ်တစ်ခုကို စတင်ပါ။',
  stop: 'စီစဉ်ထားသော အလုပ်များကို ရပ်ပါ။',
  stats: 'စီစဉ်ထားသည့်အလုပ်များ၏ အကောင်အထည်ဖော်မှုအခြေအနေကို စစ်ဆေးပါ။',
  not_started: 'စီစဉ်ထားသော လုပ်ဆောင်စရာကို မစတင်ရသေးပါ၊ ဆိပ်ကမ်း- {{port}}',
  invalid_cron_time: 'မမှန်ကန်သော cron ဖော်ပြချက်- {{time}}',
});
