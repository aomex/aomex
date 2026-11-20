import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-sk */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Nepodarilo sa vytvoriť reláciu: opakované pokusy o zápis zlyhali, skontrolujte úložný adaptér',
  session_max_age_invalid: 'cookie.maxAge musí byť kladné číslo (v sekundách)',
});
