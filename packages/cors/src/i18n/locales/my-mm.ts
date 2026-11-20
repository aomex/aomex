import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials သည် true ဖြစ်နေစဉ် origin ကို ရှင်းလင်းစွာ သတ်မှတ်ရမည် (တိကျသော origin၊ ခွင့်ပြုစာရင်း သို့မဟုတ် တိကျသော origin ပြန်ပေးသော function)။ မူရင်းပြန်ဟပ်မှုကို ခွင့်မပြုပါ',
  credentials_with_wildcard_origin:
    'credentials သည် true ဖြစ်နေစဉ် origin ကို "*" မထားရပါ: ဘရောက်ဆာများက ဤပေါင်းစပ်မှုကို လက်မခံပါ؛ တိကျသော origin၊ ခွင့်ပြုစာရင်း သို့မဟုတ် တိကျသော origin ပြန်ပေးသော function သို့ ပြောင်းပါ',
});
