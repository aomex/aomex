/**
 * 标准日志等级（低 → 高）。选用约定：
 * - `trace`：极细诊断（逐步追踪、协议帧、循环内细节）；生产建议在 transport 上门禁关掉
 * - `debug`：开发调试（关键变量、分支走向）；生产建议在 transport 上门禁关掉
 * - `info`：正常业务事件（启动、请求完成、任务成功）
 * - `warn`：可恢复异常或需关注的降级（重试、兜底、配置不当）
 * - `error`：请求/任务失败，服务仍可继续（未处理异常、下游失败）
 * - `fatal`：进程级致命错误，随后通常应退出（启动失败、数据损坏）
 *
 * 框架不会按 `NODE_ENV` 自动过滤；未配 `TransportEntry.level` 时六级全开。
 */
export const LOGGER_LEVELS = [
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
] as const;

export type LoggerLevel = (typeof LOGGER_LEVELS)[number];

/**
 * 等级门槛：
 * - 单个 level：视为最低等级（含该级及以上）
 * - `{ min, max? }` / `{ min?, max }`：闭区间，至少指定一端
 */
export type LoggerLevelGate =
  | LoggerLevel
  | { min: LoggerLevel; max?: LoggerLevel }
  | { min?: LoggerLevel; max: LoggerLevel };

/** 序列化后的异常（`type` / `message` / `stack` / `cause`） */
export interface SerializedError {
  type: string;
  message: string;
  stack?: string;
  cause?: SerializedError;
}

/** `withBindings()` 挂上的结构化上下文（任意业务键值） */
export type LoggerBindings = Record<string, unknown>;

export interface LogRecord {
  timestamp: Date;
  level: LoggerLevel;
  message: string;
  exception?: SerializedError;
  /** 来自 `withBindings()` 异步上下文的结构化字段 */
  bindings?: LoggerBindings;
}
