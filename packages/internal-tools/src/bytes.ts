import rawBytes from 'bytes';
import { createI18n } from './i18n';

const i18n = createI18n({
  zh: {
    invalid_bytes: '无效的字节大小：{{value}}',
  },
  en: {
    invalid_bytes: 'Invalid byte size: {{value}}',
  },
});

/** 与 `bytes` 包格式化选项一致（从 `format` 重载提取，避免 default 重载干扰） */
export type BytesOptions = NonNullable<Parameters<(typeof rawBytes)['format']>[1]>;

/**
 * 将字节数格式化为可读字符串，或将带单位的字符串解析为字节数。
 * 非法输入抛错（底层 `bytes` 对非法值返回 `null`）。
 */
export function bytes(value: number, options?: BytesOptions): string;
export function bytes(value: string): number;
export function bytes(value: string | number, options?: BytesOptions): string | number {
  const result = typeof value === 'number' ? rawBytes(value, options) : rawBytes(value);
  if (result == null) {
    throw new TypeError(i18n.t('invalid_bytes', { value: String(value) }));
  }
  return result;
}
