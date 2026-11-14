import { afterEach, expect, test } from 'vitest';
import {
  I18N_LANGUAGES,
  I18n,
  createI18n,
  ensureI18nLanguage,
  i18nLanguageAlias,
  resetI18nRegistry,
  resolveI18nLanguage,
} from '../src';

afterEach(() => {
  resetI18nRegistry();
});

test('I18N_LANGUAGES 为 BCP 47 闭集', () => {
  expect(I18N_LANGUAGES).toContain('zh-CN');
  expect(I18N_LANGUAGES).toContain('zh-TW');
  expect(I18N_LANGUAGES).toContain('zh-HK');
  expect(I18N_LANGUAGES).toContain('en-US');
  expect(I18N_LANGUAGES).toContain('en-GB');
  expect(I18N_LANGUAGES).toContain('be-BY');
  expect(I18N_LANGUAGES).toContain('tk-TM');
  expect(I18N_LANGUAGES).not.toContain('by-BY');
  expect(I18N_LANGUAGES).not.toContain('tk-TK');
  expect(I18N_LANGUAGES.length).toBeGreaterThanOrEqual(60);
});

test('resolveI18nLanguage：大小写 / 下划线 / 截断 / primary 默认', () => {
  expect(resolveI18nLanguage('zh-CN')).toBe('zh-CN');
  expect(resolveI18nLanguage('zh_CN')).toBe('zh-CN');
  expect(resolveI18nLanguage('zh-cn')).toBe('zh-CN');
  expect(resolveI18nLanguage('zh-Hans-CN')).toBe('zh-CN');
  expect(resolveI18nLanguage('zh-Hant')).toBe('zh-TW');
  expect(resolveI18nLanguage('zh')).toBe('zh-CN');
  expect(resolveI18nLanguage('en')).toBe('en-US');
  expect(resolveI18nLanguage('ja')).toBe('ja-JP');
  expect(resolveI18nLanguage('be')).toBe('be-BY');
  expect(resolveI18nLanguage('pt')).toBe('pt-PT');
  expect(resolveI18nLanguage('*')).toBeUndefined();
  expect(resolveI18nLanguage('xx-YY')).toBeUndefined();
});

test('别名表覆盖规范码与 primary 默认', async () => {
  const zh = I18n.define({ hello: '你好' });
  const en = I18n.satisfies(zh).define({ hello: 'Hello' });
  const i18n = createI18n({ zh, en });

  expect(i18nLanguageAlias['zh']).toBe('zh-CN');
  expect(i18nLanguageAlias['zh_CN']).toBe('zh-CN');
  expect(i18nLanguageAlias['zh-cn']).toBe('zh-CN');
  expect(i18nLanguageAlias['en']).toBe('en-US');
  expect(i18nLanguageAlias['en_US']).toBe('en-US');
  expect(i18nLanguageAlias['en-us']).toBe('en-US');

  await i18n.changeLanguage('zh');
  expect(i18n.language).toBe('zh-CN');
  expect(i18n.t('hello')).toBe('你好');

  await i18n.changeLanguage('en-us');
  expect(i18n.language).toBe('en-US');
  expect(i18n.t('hello')).toBe('Hello');
});

test('ensureI18nLanguage 会加载异步资源', async () => {
  const zh = I18n.define({ hello: '你好' });
  const en = I18n.satisfies(zh).define({ hello: 'Hello' });
  const i18n = createI18n({
    zh,
    en,
    load: async (file) => {
      if (file === 'ja-jp') {
        return { default: I18n.satisfies(zh).define({ hello: 'こんにちは' }) };
      }
      throw new Error(`missing ${file}`);
    },
  });

  await ensureI18nLanguage('ja-JP');
  expect(i18n.t('hello')).toBe('こんにちは');
});

test('defaultLanguage 固定为 zh-CN', () => {
  const zh = I18n.define({ hello: '你好' });
  const en = I18n.satisfies(zh).define({ hello: 'Hello' });
  const i18n = createI18n({ zh, en });
  expect(i18n.language).toBe('zh-CN');
});

test('zh-HK / zh-TW 不互相吞并', () => {
  expect(i18nLanguageAlias['zh-HK']).toBe('zh-HK');
  expect(i18nLanguageAlias['zh-hk']).toBe('zh-HK');
  expect(i18nLanguageAlias['zh_TW']).toBe('zh-TW');
  expect(i18nLanguageAlias['zh-tw']).toBe('zh-TW');
  expect(i18nLanguageAlias['zh']).toBe('zh-CN');
  expect(resolveI18nLanguage('zh-HK')).toBe('zh-HK');
  expect(resolveI18nLanguage('zh-TW')).toBe('zh-TW');
});

test('zh-CN / en-US 同步，其余按 load 异步加载，失败回退 en', async () => {
  const zh = I18n.define({ hello: '你好' });
  const en = I18n.satisfies(zh).define({ hello: 'Hello' });
  const zhTW = I18n.satisfies(zh).define({ hello: '你好（台灣）' });
  const zhHK = I18n.satisfies(zh).define({ hello: '你好（香港）' });
  const ja = I18n.satisfies(zh).define({ hello: 'こんにちは' });
  const fr = I18n.satisfies(zh).define({ hello: 'Bonjour' });

  const packs: Record<string, { hello: string }> = {
    'zh-tw': zhTW,
    'zh-hk': zhHK,
    'ja-jp': ja,
    'fr-fr': fr,
  };

  const i18n = createI18n({
    zh,
    en,
    load: async (file) => {
      const pack = packs[file];
      if (!pack) throw new Error(`missing ${file}`);
      return { default: pack };
    },
  });

  expect(i18n.t('hello')).toBe('你好');

  await ensureI18nLanguage('en-US');
  expect(i18n.t('hello')).toBe('Hello');

  await ensureI18nLanguage('ja-JP');
  expect(i18n.t('hello')).toBe('こんにちは');

  await ensureI18nLanguage('zh-TW');
  expect(i18n.t('hello')).toBe('你好（台灣）');

  await ensureI18nLanguage('zh-HK');
  expect(i18n.t('hello')).toBe('你好（香港）');

  await ensureI18nLanguage('fr-BE');
  expect(i18n.t('hello')).toBe('Bonjour');

  await ensureI18nLanguage('fr-CA');
  expect(i18n.t('hello')).toBe('Bonjour');

  await ensureI18nLanguage('en-GB');
  expect(i18n.t('hello')).toBe('Hello');

  await ensureI18nLanguage('de-DE');
  expect(i18n.t('hello')).toBe('Hello');
});

test('en-GB / fr-BE 等共用译文文件别名', async () => {
  const zh = I18n.define({ hello: '你好' });
  const en = I18n.satisfies(zh).define({ hello: 'Hello' });
  const fr = I18n.satisfies(zh).define({ hello: 'Bonjour' });
  const loaded: string[] = [];
  const i18n = createI18n({
    zh,
    en,
    load: async (file) => {
      loaded.push(file);
      if (file === 'fr-fr') return { default: fr };
      if (file === 'en-us') return { default: en };
      throw new Error(`missing ${file}`);
    },
  });

  await ensureI18nLanguage('en-GB');
  expect(i18n.t('hello')).toBe('Hello');
  expect(loaded).toContain('en-us');

  await ensureI18nLanguage('fr-BE');
  expect(i18n.t('hello')).toBe('Bonjour');
  expect(loaded).toContain('fr-fr');
});

test('未传 load 时异步语言直接复用 en', async () => {
  const zh = I18n.define({ hello: '你好' });
  const en = I18n.satisfies(zh).define({ hello: 'Hello' });
  const i18n = createI18n({ zh, en });

  await ensureI18nLanguage('ja-JP');
  expect(i18n.t('hello')).toBe('Hello');

  await ensureI18nLanguage('en-GB');
  expect(i18n.t('hello')).toBe('Hello');
});
