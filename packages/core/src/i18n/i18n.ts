import type { I18nMessage } from './i18n-message';

export namespace I18n {
  /**
   * 语言列表，可扩展
   */
  export interface Locales {
    zh_CN: true;
    en_US: true;
  }

  /**
   * 类型声明，可扩展
   */
  export interface Definition {}

  export type LocaleName = keyof Locales;
  export type Content = GetContent<I18n.Definition>;
  export type Keys = GetKeys<Definition>;
  export type Args<Key extends string> = GetArgs<Definition, Key, ''>;
  export type PartialContent = GetPartialContent<I18n.Definition>;
}

export class I18n {
  protected localeName: I18n.LocaleName;
  protected fallbackLocaleName?: I18n.LocaleName;
  protected contents: Record<string, I18n.Content> = {};

  constructor(locale: I18n.LocaleName, fallbackLocale?: I18n.LocaleName) {
    this.localeName = locale;
    this.fallbackLocaleName = fallbackLocale;
  }

  register<K extends keyof I18n.Content>(
    locale: I18n.LocaleName,
    category: K,
    content: I18n.Content[K],
  ) {
    // @ts-ignore
    this.contents[locale] = {
      ...this.contents[locale],
      ...{ [category]: content },
    };
  }

  override(locale: I18n.LocaleName, content: I18n.PartialContent) {
    const data = this.contents[locale]!;
    this.set(data, content);
  }

  t<Key extends I18n.Keys>(
    key: Key,
    ...rest: unknown extends I18n.Args<Key>
      ? [params?: undefined, specificLocale?: I18n.LocaleName]
      : [params: I18n.Args<Key>, specificLocale?: I18n.LocaleName]
  ): string {
    const params = rest[0] || {};
    const specificLocale = rest[1];
    const localeName = specificLocale || this.getLocale();
    const content = this.contents[localeName];
    let sub:
      | undefined
      | object
      | string
      | { message: string; args: Record<string, string | ((arg: any) => any)> } = content;
    if (sub) {
      for (const k of key.split('.')) {
        // @ts-expect-error
        sub = sub[k];
        if (!sub) break;
      }
    }
    if (sub) {
      if (typeof sub === 'string') {
        return this.format(sub, params);
      }

      if (this.isMessageObject(sub)) {
        const mergedArgs: Record<string, any> = {};
        for (const [argName, argValue] of Object.entries(params)) {
          const defaultArg = sub.args[argName];
          mergedArgs[argName] =
            typeof defaultArg === 'function' ? defaultArg(argValue) : argValue;
        }
        for (const [argName, argValue] of Object.entries(sub.args)) {
          if (!Object.hasOwn(mergedArgs, argName)) {
            mergedArgs[argName] =
              typeof argValue === 'function' ? argValue(undefined) : argValue;
          }
        }
        return this.format(sub.message, mergedArgs);
      }
    }

    if (
      !specificLocale &&
      this.fallbackLocaleName &&
      localeName !== this.fallbackLocaleName
    ) {
      return this.t(
        key,
        // @ts-expect-error
        params,
        this.fallbackLocaleName,
      );
    }

    return key;
  }

  getLocale(): I18n.LocaleName {
    return this.localeName;
  }

  setLocale(localeName: I18n.LocaleName) {
    this.localeName = localeName;
    return this;
  }

  getFallbackLocale(): I18n.LocaleName | undefined {
    return this.fallbackLocaleName;
  }

  setFallbackLocale(locale: I18n.LocaleName | undefined) {
    this.fallbackLocaleName = locale;
    return this;
  }

  protected format(message: string, args: object) {
    for (let [argName, argValue] of Object.entries(args)) {
      message = message.replace(`{{${argName}}}`, String(argValue));
    }
    return message;
  }

  protected set(data: Record<string, any>, override: Record<string, any>) {
    Object.entries(override).forEach(([key, value]) => {
      if (value === undefined) return;
      const origin = data[key];
      if (!origin) return;
      if (typeof value === 'string' || this.isMessageObject(value)) {
        data[key] = value;
      } else {
        this.set(origin, value);
      }
    });
  }

  protected isMessageObject(
    value: any,
  ): value is { message: string; args: Record<string, any> } {
    return (
      typeof value === 'object' &&
      typeof value['message'] === 'string' &&
      typeof value['args'] === 'object'
    );
  }
}

export const i18n = new I18n('zh_CN');

type GetContent<T extends object> = {
  [K in keyof T]: T[K] extends I18nMessage<infer R>
    ?
        | string
        | {
            message: string;
            args: {
              [P in keyof R]?: R[P] | ((arg: R[P]) => any);
            };
          }
    : T[K] extends object
      ? GetContent<T[K]>
      : never;
};

type GetPartialContent<T extends object> = {
  [K in keyof T]?: T[K] extends I18nMessage<infer R>
    ?
        | string
        | {
            message: string;
            args: {
              [P in keyof R]?: R[P] | ((arg: R[P]) => any);
            };
          }
    : T[K] extends object
      ? GetPartialContent<T[K]>
      : never;
};

type GetKeys<T extends object> = {
  [K in keyof T]: K extends string
    ? T[K] extends object
      ? T[K] extends I18nMessage
        ? K
        : `${K}.${GetKeys<T[K]>}`
      : K
    : never;
}[keyof T];

type GetArgs<T extends object, MatchKey extends string, Parent extends string = ''> = {
  [K in keyof T]: K extends string
    ? T[K] extends object
      ? T[K] extends I18nMessage<infer R>
        ? CombineKey<Parent, K> extends MatchKey
          ? R
          : never
        : GetArgs<T[K], MatchKey, CombineKey<Parent, K>>
      : never
    : never;
}[keyof T];

type CombineKey<
  Parent extends string,
  Key extends string,
> = `${Parent}${'' extends Parent ? '' : '.'}${Key}`;
