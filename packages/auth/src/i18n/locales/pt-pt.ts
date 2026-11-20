import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-pt */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Não foi possível criar a sessão: várias tentativas de escrita falharam, verifique o adaptador de armazenamento',
  session_max_age_invalid: 'cookie.maxAge deve ser um número positivo (em segundos)',
});
