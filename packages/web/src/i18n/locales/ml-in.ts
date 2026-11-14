import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ml-IN */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} ഒരു ഫയൽ ആയിരിക്കണം',
      too_large: '{{label}} ഫയൽ വളരെ വലുതാണ്',
      unsupported_mimetype: 'ഫയൽ തരം {{label}} പിന്തുണയ്ക്കുന്നില്ല',
    },
  },
  response: {
    redirect: '{{url}} ലേക്ക് റീഡയറക്ട് ചെയ്യുന്നു',
  },
});
