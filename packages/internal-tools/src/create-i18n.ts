import { I18n } from '@i18nx/node';

/**
 * 框架支持的语言标签（BCP 47）。
 * 列表 = 有（或计划有）译文的闭集，供 TypeScript 提示；不是第三方 UI 库的 locale 表。
 * 翻译母本为 `zh-CN`。
 */
export const I18N_LANGUAGES = [
  'ar-EG',
  'az-AZ',
  'be-BY',
  'bg-BG',
  'bn-BD',
  'ca-ES',
  'cs-CZ',
  'da-DK',
  'de-DE',
  'el-GR',
  'en-GB',
  'en-US',
  'es-ES',
  'es-US',
  'et-EE',
  'eu-ES',
  'fa-IR',
  'fi-FI',
  'fr-BE',
  'fr-CA',
  'fr-FR',
  'ga-IE',
  'gl-ES',
  'he-IL',
  'hi-IN',
  'hr-HR',
  'hu-HU',
  'hy-AM',
  'id-ID',
  'is-IS',
  'it-IT',
  'ja-JP',
  'ka-GE',
  'kk-KZ',
  'km-KH',
  'kmr-IQ',
  'kn-IN',
  'ko-KR',
  'ku-IQ',
  'lt-LT',
  'lv-LV',
  'mk-MK',
  'ml-IN',
  'mn-MN',
  'mr-IN',
  'ms-MY',
  'my-MM',
  'nb-NO',
  'ne-NP',
  'nl-BE',
  'nl-NL',
  'pl-PL',
  'pt-BR',
  'pt-PT',
  'ro-RO',
  'ru-RU',
  'si-LK',
  'sk-SK',
  'sl-SI',
  'sr-RS',
  'sv-SE',
  'ta-IN',
  'th-TH',
  'tk-TM',
  'tr-TR',
  'uk-UA',
  'ur-PK',
  'uz-UZ',
  'vi-VN',
  'zh-CN',
  'zh-HK',
  'zh-TW',
] as const;

export type I18nLanguage = (typeof I18N_LANGUAGES)[number];

/**
 * 同一 primary language 下有多个地区时的默认落点（产品约定，非 BCP 47 强制）。
 * 仅一处时由 {@link resolveI18nLanguage} 自动落到该唯一项。
 */
const PRIMARY_DEFAULT = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  nl: 'nl-NL',
  pt: 'pt-PT',
  zh: 'zh-CN',
} as const satisfies Record<string, I18nLanguage>;

/** BCP 47 脚本子标签（小写键）→ 可用规范码 */
const SCRIPT_DEFAULT: Record<string, I18nLanguage> = {
  'zh-hans': 'zh-CN',
  'zh-hant': 'zh-TW',
};

const languageByLower = new Map<string, I18nLanguage>(
  I18N_LANGUAGES.map((code) => [code.toLowerCase(), code]),
);

const languagesByPrimary = new Map<string, I18nLanguage[]>();
for (const code of I18N_LANGUAGES) {
  const primary = code.split('-')[0]!.toLowerCase();
  const list = languagesByPrimary.get(primary);
  if (list) list.push(code);
  else languagesByPrimary.set(primary, [code]);
}

/**
 * 将任意语言标签归一到 {@link I18N_LANGUAGES}（RFC 4647 Lookup + 前缀回退）。
 * - `_` → `-`，大小写不敏感
 * - 自右向左截断子标签再精确匹配
 * - 只剩 primary 时：唯一候选直接用；多个则用 {@link PRIMARY_DEFAULT}
 */
export function resolveI18nLanguage(tag: string): I18nLanguage | undefined {
  const normalized = tag.trim().replaceAll('_', '-');
  if (!normalized || normalized === '*') return undefined;

  let range = normalized;
  while (true) {
    const lower = range.toLowerCase();
    const exact = languageByLower.get(lower);
    if (exact) return exact;

    const script = SCRIPT_DEFAULT[lower];
    if (script) return script;

    const dash = range.lastIndexOf('-');
    if (dash <= 0) {
      const primaryDefault = PRIMARY_DEFAULT[lower as keyof typeof PRIMARY_DEFAULT];
      if (primaryDefault) return primaryDefault;
      const only = languagesByPrimary.get(lower);
      if (only?.length === 1) return only[0];
      return undefined;
    }
    // 跳过单字符扩展子标签（如 `en-US-x-foo` 截到 `en-US-x` 后再截）
    range = range.slice(0, dash);
  }
}

function buildLanguageAlias(): Record<string, I18nLanguage> {
  const alias: Record<string, I18nLanguage> = {};

  for (const code of I18N_LANGUAGES) {
    alias[code] = code;
    alias[code.replaceAll('-', '_')] = code;
    alias[code.toLowerCase()] = code;
  }

  for (const [script, lang] of Object.entries(SCRIPT_DEFAULT)) {
    alias[script] = lang;
  }
  alias['zh-Hans'] = 'zh-CN';
  alias['zh-Hant'] = 'zh-TW';

  for (const [primary, lang] of Object.entries(PRIMARY_DEFAULT)) {
    alias[primary] = lang;
  }

  for (const [primary, list] of languagesByPrimary) {
    if (list.length === 1 && !(primary in PRIMARY_DEFAULT)) {
      alias[primary] = list[0]!;
    }
  }

  return alias;
}

/**
 * 供 `@i18nx/node` 的 `languageAlias`：规范码 / 下划线 / 小写 / primary 默认。
 * 更完整的协商请用 {@link resolveI18nLanguage}。
 */
export const i18nLanguageAlias: Record<string, I18nLanguage> = buildLanguageAlias();

/** 与母本同结构，叶子文案不要求字面量相同。 */
type I18nMessageTree<T> = T extends string
  ? string
  : T extends object
    ? { [K in keyof T]: I18nMessageTree<T[K]> }
    : T;

/**
 * 共用同一份译文文件的地区 → 小写文件名。
 * 例如 `fr-BE` / `fr-CA` 都读 `fr-fr`。
 */
const I18N_LOCALE_FILE_ALIAS = {
  'en-GB': 'en-us',
  'fr-BE': 'fr-fr',
  'fr-CA': 'fr-fr',
  'nl-BE': 'nl-nl',
  'es-US': 'es-es',
} as const satisfies Partial<Record<I18nLanguage, string>>;

type CreateI18nOptions<T extends object> = {
  zh: T;
  en: NoInfer<I18nMessageTree<T>>;
  /**
   * 按小写文件名加载语言包（如 `ja-jp`）。
   * 文件不存在或加载失败时回退到 `en`。
   */
  load?: (file: string) => Promise<{ default: NoInfer<I18nMessageTree<T>> }>;
};

type I18nResourcesFromOptions<T extends object> = {
  [K in I18nLanguage]: K extends 'zh-CN'
    ? T
    : K extends 'en-US'
      ? I18nMessageTree<T>
      : I18nMessageTree<T> | (() => Promise<I18nMessageTree<T>>);
};

const instances = new Set<I18n<any, any, any>>();

/**
 * 创建并注册包级 i18n 实例。
 * - `zh` / `en` 同步；其余按 `load` 按需加载（失败回退 `en`）
 * - `defaultLanguage` 固定为 `zh-CN`
 * - 统一挂上 {@link i18nLanguageAlias}；异步语言需先 {@link ensureI18nLanguage} 再翻译
 *
 * ```ts
 * createI18n({
 *   zh,
 *   en,
 *   load: (file) => import(new URL(`./locales/${file}.js`, import.meta.url).href),
 * });
 * ```
 */
export function createI18n<const T extends object>(
  opts: CreateI18nOptions<T>,
): I18n<I18nResourcesFromOptions<T>, I18nLanguage, 'zh-CN'> {
  const resources = {} as I18nResourcesFromOptions<T>;

  for (const lang of I18N_LANGUAGES) {
    if (lang === 'zh-CN') {
      resources[lang] = opts.zh;
      continue;
    }
    if (lang === 'en-US' || !opts.load) {
      resources[lang] = opts.en;
      continue;
    }

    const file =
      I18N_LOCALE_FILE_ALIAS[lang as keyof typeof I18N_LOCALE_FILE_ALIAS] ??
      lang.toLowerCase();
    const load = opts.load;
    resources[lang] = async () => {
      try {
        return (await load(file)).default;
      } catch {
        return opts.en;
      }
    };
  }

  const i18n = new I18n({
    resources,
    defaultLanguage: 'zh-CN',
    languageAlias: i18nLanguageAlias,
  });
  instances.add(i18n);
  return i18n;
}

/**
 * 确保所有已注册包的对应语言资源已加载。
 * `I18n.provider` 只注入 ALS 语言码，不会加载异步 `resources`；
 * 在 provider 之前调用本函数。
 */
export async function ensureI18nLanguage(language: string): Promise<void> {
  await Promise.all([...instances].map((i18n) => i18n.changeLanguage(language)));
}

/** @internal 测试用：清空注册表 */
export function resetI18nRegistry(): void {
  instances.clear();
}
