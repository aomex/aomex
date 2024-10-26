import { I18n } from '@aomex/internal-tools';
import { locales } from './locales';

export const i18n = new I18n({
  resources: locales,
  defaultLanguage: 'zh_CN',
});
