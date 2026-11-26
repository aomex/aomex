import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers သည် ဗလာမဖြစ်ရ',
  empty_broker: 'brokers တွင် ဗလာလိပ်စာ ပါရှိသည်',
  empty_client_id: 'clientId သည် ဗလာမဖြစ်ရ',
  empty_group_id: 'groupId သည် ဗလာမဖြစ်ရ',
  empty_topic: 'ခေါင်းစဉ်အမည်သည် ဗလာမဖြစ်ရ',
  invalid_topic_name: 'ခေါင်းစဉ်အမည် မမှန်ကန်: {{topic}}',
  topic_name_too_long: 'ခေါင်းစဉ်အမည် ရှည်လွန်းသည်: {{length}} > {{max}}',
  duplicate_topic: 'ခေါင်းစဉ်ကို တစ်ကြိမ်ထက်ပို၍ မှတ်ပုံတင်ထားသည်: {{topic}}',
  mixed_group_id: 'consume ခေါ်ဆိုမှုတစ်ခုတွင် groupId တစ်ခုသာ ရှိနိုင်သည်',
  empty_consumers: 'Kafka စားသုံးသူ မတွေ့ပါ',
  already_consuming: 'စားသုံးသူ တစ်ဦး လည်ပတ်နေပြီးဖြစ်သည်',
  closed: 'Kafka ချိတ်ဆက်မှု ပိတ်ထားသည်',
  message_too_large: 'မက်ဆေ့ခ်ျအရွယ်အစား ကန့်သတ်ချက်ကျော်လွန်: {{bytes}} > {{max}}',
  invalid_json: 'မက်ဆေ့ခ်ျသည် တရားဝင် JSON မဟုတ်',
  empty_message: 'မက်ဆေ့ခ်ျကိုယ်ထည် ဗလာဖြစ်သည်',
  encode_failed: 'မက်ဆေ့ခ်ျကို JSON အဖြစ် ကုဒ်ပြောင်းမရပါ',
  unknown_topic: 'စာရင်းမသွင်းထားသော ခေါင်းစဉ် လက်ခံရရှိ: {{topic}}',
  invalid_offset: 'မက်ဆေ့ခ်ျ အော့ဖ်ဆက် မမှန်ကန်: {{offset}}',
  idempotent_requires_all_acks: 'idempotent producer ဖွင့်ထားသောအခါ acks သည် -1 ဖြစ်ရမည်',
  unsupported_sasl: 'မပံ့ပိုးသော SASL ယန္တရား: {{mechanism}}',
  unsupported_tls: 'TLS ရွေးချယ်မှုကို client သို့ ပေးပို့မရ: {{name}}',
  heartbeat_exceeds_session: 'နှလုံးခုန်ကြားကာလသည် ဆက်ရှင် အချိန်ကုန်ထက် ငယ်ရမည်',
});
