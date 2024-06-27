export abstract class I18nMessage<Args extends object | unknown = unknown> {
  protected declare readonly __i18n_message__: 'i18n-message';
  protected declare readonly generic: Args;
}
