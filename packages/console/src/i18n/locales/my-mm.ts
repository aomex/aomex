import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" အမိန့်မရှိပါ။',
  command_found_recommended: '"{{command}}" အမိန့်မရှိပါ။ "aomex {{recommended}}" ကိုဆိုလိုတာလား။',
  help: {
    command: '[အမိန့်တော်]',
    option: '[ရွေးချယ်စရာများ]',
    version: '{{scriptName}} ဗားရှင်းနံပါတ်ကို ပြသပါ။',
    no_usage: '"{{command}}" အမိန့်ကိုအသုံးပြုမှုကို ရှာမတွေ့ပါ။',
  },
});
