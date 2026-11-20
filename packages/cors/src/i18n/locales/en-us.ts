import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  credentials_without_origin:
    'origin must be set explicitly when credentials is true (a concrete origin, a whitelist, or a function that returns a concrete origin); default reflection is not allowed',
  credentials_with_wildcard_origin:
    'origin cannot be "*" when credentials is true: browsers reject this combination; use a concrete origin, a whitelist, or a function that returns a concrete origin',
});
