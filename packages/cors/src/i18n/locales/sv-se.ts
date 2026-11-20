import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'när credentials är true måste origin anges uttryckligen (konkret origin, vitlista eller funktion som returnerar ett konkret origin); standardreflektion är inte tillåten',
  credentials_with_wildcard_origin:
    'när credentials är true får origin inte vara "*": webbläsare avvisar denna kombination; använd ett konkret origin, en vitlista eller en funktion som returnerar ett konkret origin',
});
