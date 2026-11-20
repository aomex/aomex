import { I18n } from '@aomex/common';

export const zh = I18n.define({
  credentials_without_origin:
    'credentials 为 true 时必须显式配置 origin（具体来源、白名单或返回具体来源的函数），禁止依赖默认反射',
  credentials_with_wildcard_origin:
    'credentials 为 true 时禁止 origin 为 "*"：浏览器不认该组合，请改为具体来源、白名单或返回具体来源的函数',
});
