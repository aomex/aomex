import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'þegar credentials er true verður origin að vera stillt skýrt (ákveðið origin, hvítlisti eða fall sem skilar ákveðnu origin); sjálfgefin speglun er ekki leyfð',
  credentials_with_wildcard_origin:
    'þegar credentials er true má origin ekki vera "*": vafrar hafna þessari samsetningu; notaðu ákveðið origin, hvítlista eða fall sem skilar ákveðnu origin',
});
