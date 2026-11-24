import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'မမှန်ကန်သော ဖြစ်ရပ်အမည်',
  invalid_room_name: 'မမှန်ကန်သော အခန်းအမည်',
  unknown_event: 'မသိသော ဖြစ်ရပ်: {{event}}',
  handler_error: 'ဖြစ်ရပ်ကို စီမံဆောင်ရွက်ခြင်း မအောင်မြင်ပါ',
  duplicate_event: 'ဖြစ်ရပ်ကို မှတ်ပုံတင်ပြီးသားဖြစ်သည်: {{event}}',
  already_attached: 'WebsocketApp ကို attach လုပ်ပြီးသားဖြစ်သည်၊ ထပ်မံ မတပ်ဆင်ပါနှင့်',
  transport_init_failed: 'WebSocket ပို့ဆောင်မှုကို စတင်၍ မရပါ',
  handshake_failed: 'WebSocket လက်ဆွဲခြင်း မအောင်မြင်ပါ',
  accept_failed: 'ချိတ်ဆက်မှုကို လက်ခံ၍ မရပါ',
  fanout_deliver_failed: 'ဖြန့်ဝေစဉ် ချိတ်ဆက်မှု {{failed}} ခုသို့ ရေးခြင်း မအောင်မြင်ပါ',
  inbound_task_failed: 'ဝင်လာသော ဖြစ်ရပ်ကို စီမံ၍ မရပါ',
  error_frame_failed: 'အမှားဘောင်ကို ပို့၍ မရပါ',
  remove_client_failed: 'ချိတ်ဆက်မှုကို ဖယ်ရှား၍ မရပါ',
  close_connection_failed: 'ချိတ်ဆက်မှုကို ပိတ်၍ မရပါ',
  metric_handler_failed: 'မက်ထရစ် ပြန်ခေါ်မှု မအောင်မြင်ပါ',
});
