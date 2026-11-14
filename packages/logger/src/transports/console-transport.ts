import { styleText } from 'node:util';
import type tty from 'node:tty';
import { Transport, type TransportFormat } from './transport';
import type { LogRecord, LoggerLevel } from '../types';

type Style = Parameters<typeof styleText>[0];

/** 默认等级配色 */
const DEFAULT_LEVEL_COLORS: Record<LoggerLevel, Style> = {
  trace: 'gray',
  debug: 'blueBright',
  info: 'green',
  warn: 'yellow',
  error: 'red',
  fatal: 'magentaBright',
};

const DEFAULT_STDERR_LEVELS: LoggerLevel[] = ['error', 'fatal'];

export class ConsoleTransport extends Transport {
  protected readonly format: TransportFormat;
  protected readonly colorize: boolean;
  protected readonly colors: Record<string, Style>;
  protected readonly stdout: tty.WriteStream;
  protected readonly stderr: tty.WriteStream;
  protected readonly stderrLevelSet: Set<LoggerLevel>;
  /** 若构造时显式传入 `output`，则所有等级走同一流 */
  protected readonly forcedOutput?: tty.WriteStream;

  constructor(
    opts: {
      /**
       * 输出格式。默认 `text`；生产采集建议 `json`。
       */
      format?: TransportFormat;
      /**
       * 是否着色。默认：`text` 且目标流为 TTY 时开启。
       */
      colorize?: boolean;
      /**
       * 覆盖默认等级颜色。
       */
      colors?: Partial<Record<LoggerLevel, Style>>;
      /**
       * 固定输出流（设置后忽略 `stderrLevels` 分流）。
       */
      output?: tty.WriteStream;
      /**
       * 未设置 `output` 时，这些等级写入 stderr。默认 `error` / `fatal`。
       */
      stderrLevels?: LoggerLevel[];
      stdout?: tty.WriteStream;
      stderr?: tty.WriteStream;
    } = {},
  ) {
    super();
    this.format = opts.format ?? 'text';
    this.stdout = opts.stdout ?? process.stdout;
    this.stderr = opts.stderr ?? process.stderr;
    this.forcedOutput = opts.output;
    this.colors = { ...DEFAULT_LEVEL_COLORS, ...opts.colors };
    this.stderrLevelSet = new Set(opts.stderrLevels ?? DEFAULT_STDERR_LEVELS);

    const primary = this.forcedOutput ?? this.stdout;
    this.colorize = opts.colorize ?? (this.format === 'text' && primary.isTTY === true);
  }

  override async consume(log: LogRecord): Promise<any> {
    const writer = this.resolveWriter(log.level);
    writer.write(this.render(log) + '\n');
  }

  protected resolveWriter(level: LoggerLevel): tty.WriteStream {
    if (this.forcedOutput) return this.forcedOutput;
    return this.stderrLevelSet.has(level) ? this.stderr : this.stdout;
  }

  protected render(log: LogRecord): string {
    if (this.format === 'json' || !this.colorize) {
      return this.formatLog(log, this.format);
    }

    const color = this.colors[log.level];
    const time = this.dateToString(log.timestamp);
    const level = `[${log.level}]`;
    const bindings = log.bindings != null ? ` ${JSON.stringify(log.bindings)}` : '';
    const head = color
      ? `${styleText(color, level)} ${styleText(color, time)} ${log.message}${bindings}`
      : `${level} ${time} ${log.message}${bindings}`;

    if (log.exception?.stack) {
      return `${head}\n${log.exception.stack}`;
    }
    if (log.exception) {
      return `${head}\n${log.exception.type}: ${log.exception.message}`;
    }
    return head;
  }
}
