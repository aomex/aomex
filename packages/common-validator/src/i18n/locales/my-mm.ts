import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} လိုအပ်သည်။',
    array: {
      must_be_array: '{{label}} သည် array တစ်ခု ဖြစ်ရပါမည်။',
      length_not_in_range: '{{label}} အခင်းအကျင်း အရှည်သည် သတ်မှတ်ထားသည့် အပိုင်းအခြားအတွင်း မရှိပါ။',
      not_unique: '{{label}} အခင်းအကျင်း အစိတ်အပိုင်းများကို ထပ်၍မရနိုင်ပါ။',
    },
    boolean: {
      must_be_boolean: '{{label}} သည် Boolean တန်ဖိုးဖြစ်ရပါမည်။',
    },
    buffer: {
      must_be_buffer: '{{label}} သည် Buffer ဖြစ်ရပါမည်။',
    },
    stream: {
      must_be_stream: '{{label}} သည် Stream ဖြစ်ရပါမည်။',
    },
    date: {
      must_be_date: '{{label}} ရက်စွဲဖြစ်ရမည်။',
      not_in_range: '{{label}} သည် ခွင့်ပြုထားသော အချိန်အပိုင်းအခြားအတွင်း မရှိပါ။',
    },
    number: {
      must_be_number: '{{label}} သည် နံပါတ်တစ်ခု ဖြစ်ရပါမည်။',
      must_be_integer: '{{label}} သည် ကိန်းပြည့်ဖြစ်ရပါမည်။',
      must_be_bigint: '{{label}} သည် BigInt ဖြစ်ရမည်။',
      must_be_decimal: '{{label}} သည် Decimal ဖြစ်ရမည်။',
      not_in_range: '{{label}} သည် ခွင့်ပြုထားသော တန်ဖိုးဘောင်ကို ကျော်လွန်နေပါသည်။',
    },
    string: {
      must_be_string: '{{label}} သည် စာကြောင်းတစ်ကြောင်းဖြစ်ရမည်။',
      must_be_email: '{{label}} သည် အီးမေးလ်ဖော်မတ်ဖြစ်ရပါမည်။',
      must_be_hash: '{{label}} သည် hash ဖော်မတ်ဖြစ်ရပါမည်။',
      must_be_ip: '{{label}} သည် IP{{versions}} လိပ်စာဖြစ်ရမည်။',
      must_be_ulid: '{{label}} သည် ULID ဖော်မတ်ဖြစ်ရပါမည်။',
      must_be_uuid: '{{label}} သည် UUID{{versions}} ဖော်မတ်ဖြစ်ရပါမည်။',
      length_not_in_range: '{{label}} အရှည်သည် လိုအပ်ချက်များနှင့် မကိုက်ညီပါ။',
      not_match_pattern: '{{label}} သည် စည်းကမ်းများကို မလိုက်နာပါ။',
    },
    object: {
      must_be_object: '{{label}} သည် အရာဝတ္ထုတစ်ခု ဖြစ်ရမည်။',
    },
    enum: {
      not_in_range: '{{label}} သည် စာရင်းကောက်ခြင်းအပိုင်းတွင် မရှိပါ။',
      only_support_string_number_boolean:
        'စာရင်းကောက်တန်ဖိုးများသည် စာကြောင်းများ၊ နံပါတ်များနှင့် Boolean တန်ဖိုးများသာ ဖြစ်နိုင်ပါသည်။',
      value_can_not_be_empty: 'စာရင်းကောက်တန်ဖိုးသည် အချည်းနှီးတန်ဖိုး "{{item}}" မဖြစ်ရပါ။',
      ranges_can_not_be_empty: 'စာရင်းကောက်ခြင်းအပိုင်းအခြားသည် ဗလာမဖြစ်ရပါ။',
      default_not_in_range: 'မူရင်းတန်ဖိုး "{{item}}" သည် စာရင်းကောက်သည့်အပိုင်းတွင် မရှိပါ။',
    },
    literal: {
      not_match: '{{label}} သည် သတ်မှတ်ထားသောတန်ဖိုးမဟုတ်ပါ။',
      unsupported_value: 'လိုင်းများ၊ နံပါတ်များ၊ booleans နှင့် null များကိုသာ ပံ့ပိုးပေးသည်။',
    },
    one_of: {
      not_match_rule: '{{label}} သည် စည်းကမ်းများကို မလိုက်နာပါ။',
      match_multiple_rule: '{{label}} သည် စည်းကမ်းများစွာကို လိုက်နာပါသည်။',
    },
    any_of: {
      not_match_rule: '{{label}} သည် စည်းကမ်းများကို မလိုက်နာပါ။',
    },
    all_of: {
      not_match_all: '{{label}} သည် စည်းကမ်းအားလုံးနှင့် မကိုက်ညီပါ။',
    },
    url: {
      must_be_url: '{{label}} သည် URL ဖော်မတ်ဖြစ်ရပါမည်။',
      unsupported_scheme: '{{label}} တွင် ပံ့ပိုးမထားသော URL ပရိုတိုကော ပါရှိသည်- {{scheme}}',
    },
  },
});
