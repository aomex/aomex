import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ta-in */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'அமர்வை உருவாக்க முடியவில்லை: பல எழுதும் முயற்சிகள் தோல்வியடைந்தன, சேமிப்பக அடாப்டரைச் சரிபார்க்கவும்',
  session_max_age_invalid: 'cookie.maxAge நேர்மறை எண்ணாக இருக்க வேண்டும் (வினாடிகளில்)',
});
