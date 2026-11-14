import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} သည် ဖိုင်ဖြစ်ရပါမည်။',
      too_large: '{{label}} ဖိုင်သည် ကြီးလွန်းသည်။',
      unsupported_mimetype: 'ဖိုင်အမျိုးအစား {{label}} ကို ပံ့ပိုးမထားပါ။',
    },
  },
  response: {
    redirect: '{{url}} သို့ ပြန်ညွှန်းနေသည်',
  },
});
