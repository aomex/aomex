import { createI18n } from '../create-i18n';
import { zh } from './locales/zh-cn';
import { en } from './locales/en-us';

export const i18n = createI18n({
  zh,
  en,
  load: (file) => import(new URL(`./locales/${file}.js`, import.meta.url).href),
});
