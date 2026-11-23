import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  initialize: 'ကနဦးစာရွက်စာတမ်း',
  search_channels_files: 'Channel ဖိုင်များ ရှာရန်',
  parse_channels: 'Channel များကို ခွဲခြမ်းရန်',
  hand_fix_documentation: 'စာရွက်စာတမ်းများကို ကိုယ်တိုင်ပြုပြင်ပါ။',
  save_to_file: 'ဖိုင်တွင်သိမ်းဆည်းပါ။',
  validate: 'စာရွက်စာတမ်းကို အတည်ပြုပါ။',
  help_summary: 'AsyncAPI 3 စာရွက်စာတမ်း ဖန်တီးကိရိယာ',
  has_error: '{{error_count}} အမှားအယွင်းများ၊ {{warning_count}} သတိပေးချက်များ',
  no_error: 'အမှားအယွင်းမရှိပါ။',
});
