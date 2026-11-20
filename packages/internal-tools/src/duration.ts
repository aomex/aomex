import { i18n } from './i18n';

const UNIT_MS = {
  ms: 1,
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
  month: 2_592_000_000, // 30 天
  y: 31_536_000_000, // 365 天
} as const;

/** 可读时长单位（与 `parseDuration` 一致） */
export type DurationUnit =
  | 'ms'
  | 's'
  | 'sec'
  | 'secs'
  | 'second'
  | 'seconds'
  | 'm'
  | 'min'
  | 'mins'
  | 'minute'
  | 'minutes'
  | 'h'
  | 'hr'
  | 'hrs'
  | 'hour'
  | 'hours'
  | 'd'
  | 'day'
  | 'days'
  | 'w'
  | 'week'
  | 'weeks'
  | 'month'
  | 'months'
  | 'y'
  | 'year'
  | 'years';

/**
 * 人类可读时长字符串，如 `1 day`、`30m`、`1.5 hours`
 */
export type DurationString = `${number}${DurationUnit}` | `${number} ${DurationUnit}`;

/**
 * 时长入参：毫秒数，或带单位的可读字符串
 */
export type DurationInput = number | DurationString;

const DURATION_RE =
  /^(\d+(?:\.\d+)?)\s*(ms|s|m|h|d|w|month|y|sec|secs|second|seconds|min|mins|minute|minutes|hr|hrs|hour|hours|day|days|week|weeks|months|year|years)$/i;

/**
 * 将毫秒数或人类可读时长解析为毫秒。
 * `month` 按 30 天、`y`/`year` 按 365 天计。
 */
export function parseDuration(value: DurationInput): number {
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(i18n.t('invalid_duration', { value: String(value) }));
    }
    return value;
  }

  const matched = value.trim().match(DURATION_RE);
  if (!matched) {
    throw new TypeError(i18n.t('invalid_duration', { value }));
  }

  const amount = Number(matched[1]);
  const rawUnit = matched[2]!.toLowerCase();
  const ms = amount * UNIT_MS[normalizeUnit(rawUnit)];
  if (!Number.isFinite(ms)) {
    throw new RangeError(i18n.t('invalid_duration', { value }));
  }
  return ms;
}

function normalizeUnit(unit: string): keyof typeof UNIT_MS {
  switch (unit) {
    case 'ms':
      return 'ms';
    case 's':
    case 'sec':
    case 'secs':
    case 'second':
    case 'seconds':
      return 's';
    case 'm':
    case 'min':
    case 'mins':
    case 'minute':
    case 'minutes':
      return 'm';
    case 'h':
    case 'hr':
    case 'hrs':
    case 'hour':
    case 'hours':
      return 'h';
    case 'd':
    case 'day':
    case 'days':
      return 'd';
    case 'w':
    case 'week':
    case 'weeks':
      return 'w';
    case 'month':
    case 'months':
      return 'month';
    case 'y':
    case 'year':
    case 'years':
      return 'y';
    default:
      throw new TypeError(i18n.t('invalid_duration', { value: unit }));
  }
}
