import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-BR */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'quando credentials é true, origin deve ser definido explicitamente (origem concreta, lista de permissões ou função que retorne uma origem concreta); a reflexão padrão não é permitida',
  credentials_with_wildcard_origin:
    'origin não pode ser "*" quando credentials é true: os navegadores rejeitam essa combinação; use uma origem concreta, uma lista de permissões ou uma função que retorne uma origem concreta',
});
