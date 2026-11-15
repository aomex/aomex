import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** si-LK */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} ගොනුවක් විය යුතුය',
      too_large: '{{label}} ගොනුව විශාල වැඩිය',
      unsupported_mimetype: '{{label}} ගොනු වර්ගය සහය නොදක්වයි',
      invalid_mimetype_token: 'අවලංගු මාධ්‍ය වර්ගයක් හෝ ගොනු දිගුවක්: {{token}}',
    },
  },
  response: {
    redirect: '{{url}} වෙත යළි යොමු කරමින්',
  },
});
