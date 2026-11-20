import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-ee */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Seanssi ei saanud luua: mitu kirjutamiskatset ebaõnnestusid, kontrollige salvestusadapterit',
  session_max_age_invalid: 'cookie.maxAge peab olema positiivne arv (sekundites)',
});
