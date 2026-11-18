export * from '@aomex/common-middleware';
export * from '@aomex/common-validator';
export * from '@aomex/common-service';
export {
  OpenAPI,
  I18n,
  sleep,
  createI18n,
  ensureI18nLanguage,
  resolveI18nLanguage,
  i18nLanguageAlias,
  I18N_LANGUAGES,
  type I18nLanguage,
} from '@aomex/internal-tools';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * @deprecated 请使用 AOMEX_RUNTIME 代替
       */
      AOMEX_CLI_MODE?: '1';
      /**
       * 运行时环境
       */
      AOMEX_RUNTIME?: 'cli';
    }
  }
}
