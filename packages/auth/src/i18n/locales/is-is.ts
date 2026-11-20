import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-is */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Ekki tókst að búa til lotu: margar skrifatilraunir mistókust, athugaðu geymsluaðlögunina',
  session_max_age_invalid: 'cookie.maxAge verður að vera jákvæð tala (í sekúndum)',
});
