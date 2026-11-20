import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-PT */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'quando credentials é true, origin deve ser definido explicitamente (origem concreta, lista branca ou função que devolva uma origem concreta); a reflexão predefinida não é permitida',
  credentials_with_wildcard_origin:
    'origin não pode ser "*" quando credentials é true: os browsers rejeitam esta combinação; use uma origem concreta, uma lista branca ou uma função que devolva uma origem concreta',
});
