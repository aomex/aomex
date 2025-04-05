import { I18n } from '@aomex/common';
import { locales } from './locales';

export const i18n = new I18n({
  resources: locales,
  defaultLanguage: 'zh_CN',
});
