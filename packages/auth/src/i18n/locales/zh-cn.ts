import { I18n } from '@aomex/common';

export const zh = I18n.define({
  session_create_failed: '无法创建会话：多次尝试写入均失败，请检查存储适配器',
  session_max_age_invalid: 'cookie.maxAge 必须为正数（单位：秒）',
});
