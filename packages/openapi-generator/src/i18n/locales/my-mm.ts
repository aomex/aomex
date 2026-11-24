import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  initialize: 'ကနဦးစာရွက်စာတမ်း',
  search_routers_files: 'လမ်းပြဖိုင်များကို ရှာဖွေပါ။',
  parse_routers: 'လမ်းကြောင်းခွဲခြမ်းစိတ်ဖြာ',
  add_tag: 'tag ထည့်ပါ။',
  hand_fix_documentation: 'စာရွက်စာတမ်းများကို ကိုယ်တိုင်ပြုပြင်ပါ။',
  optimize_parameter: 'ပိုမိုကောင်းမွန်အောင်ပြုလုပ်ခြင်း ကန့်သတ်ချက်များ',
  save_to_file: 'ဖိုင်တွင်သိမ်းဆည်းပါ။',
  validate: 'စာရွက်စာတမ်းကို အတည်ပြုပါ။',
  help_summary: 'OpenAPI v3 စာရွက်စာတမ်းထုတ်ပေးသည့်မီးစက်',
  help_app_listen_tip:
    'new WebApp နှင့် app.listen ကို ခွဲထားပါ (သို့မဟုတ် entry ဖိုင်တွင်သာ listen လုပ်ပါ)၊ CLI import က ဘေးထွက်အကျိုးသက်ရောက်မှုအဖြစ် ဆာဗာကို စတင်မည်မဟုတ်စေရန်',
  has_error: '{{error_count}} အမှားအယွင်းများ၊ {{warning_count}} သတိပေးချက်များ',
  no_error: 'အမှားအယွင်းမရှိပါ။',
});
