import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-si */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Ni mogoče ustvariti seje: več poskusov pisanja je spodletelo, preverite adapter za shranjevanje',
  session_max_age_invalid: 'cookie.maxAge mora biti pozitivno število (v sekundah)',
});
