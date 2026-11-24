import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub ပိတ်ပြီးဖြစ်၍ ထုတ်လွှင့်၍ မရပါ',
  resync_failed: 'Redis စာရင်းသွင်းမှုများကို ပြန်မရယူနိုင်ပါ',
  sync_room_failed: 'အခန်း စာရင်းသွင်းမှုကို ချိန်ညှိ၍ မရပါ: {{room}}',
  bus_fanout_failed: 'ဘတ်စ် ဖြန့်ဝေမှု မအောင်မြင်ပါ',
  destroy_ready_failed: 'ပိတ်သည့်အခါ Hub စတင်ခြင်းကို စောင့်၍ မရပါ',
});
