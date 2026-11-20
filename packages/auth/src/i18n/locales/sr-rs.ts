import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sr-rs */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Није могуће креирати сесију: вишеструки покушаји уписа нису успели, проверите адаптер складишта',
  session_max_age_invalid: 'cookie.maxAge мора бити позитиван број (у секундама)',
});
