import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-cz */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Nelze vytvořit relaci: opakované pokusy o zápis selhaly, zkontrolujte úložný adaptér',
  session_max_age_invalid: 'cookie.maxAge musí být kladné číslo (v sekundách)',
});
