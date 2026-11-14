import { Api } from 'grammy';
import { autoRetry } from '@grammyjs/auto-retry';
import { Transport, type LogRecord, type SerializedError } from '@aomex/logger';
import { i18n } from './i18n';

export const TELEGRAM_MESSAGE_MAX_LENGTH = 4096;

/** 指纹中如何纳入 `bindings`：默认不纳入；`'all'` 为全部；数组为白名单键 */
export type TelegramDedupeBindingKeys = 'all' | readonly string[];

export interface TelegramDedupeOptions {
  /**
   * 合并间隔（毫秒）。默认 `30_000`。
   * 间隔内相同指纹只发一条，正文带 `(×N)`。
   */
  interval?: number;
  /**
   * 纳入指纹的 bindings。默认不纳入（只按 `level` / `message` / `exception`），
   * 避免业务侧关联字段拆散合并；需要时自行传 `'all'` 或键名白名单。
   */
  bindingKeys?: TelegramDedupeBindingKeys;
  /** 自定义指纹；默认走 `fingerprintLog` */
  fingerprint?: (log: LogRecord) => string;
}

export interface TelegramTransportOptions {
  /** Bot token（来自 @BotFather） */
  botToken: string;
  /** 目标 chat / 群 / 频道 id */
  chatId: string | number;
  /**
   * 请求总超时（毫秒，含 auto-retry 等待）。默认 `120_000`。
   */
  timeout?: number;
  /** 自定义消息正文；默认 `formatTelegramMessage` */
  format?: (log: LogRecord) => string;
  /**
   * 间隔内相同指纹合并为一条后再发送。默认开启（间隔 30s，指纹不含 bindings）。
   * 传 `false` 则每条立即发送。
   */
  dedupe?: boolean | TelegramDedupeOptions;
}

type TelegramDedupeConfig = {
  interval: number;
  bindingKeys?: TelegramDedupeBindingKeys;
  fingerprint?: (log: LogRecord) => string;
};

type DedupeBufferEntry = {
  log: LogRecord;
  count: number;
  timer: ReturnType<typeof setTimeout>;
};

/**
 * 通过 [grammy](https://grammy.dev) `Api.sendMessage` 推送日志，
 * 固定启用 [`@grammyjs/auto-retry`](https://grammy.dev/plugins/auto-retry)。
 *
 * ```typescript
 * new TelegramTransport({
 *   botToken: process.env.TELEGRAM_BOT_TOKEN!,
 *   chatId: process.env.TELEGRAM_CHAT_ID!,
 * })
 * ```
 */
export class TelegramTransport extends Transport {
  protected readonly chatId: string | number;
  protected readonly timeout: number;
  protected readonly api: Api;
  protected readonly customFormat?: (log: LogRecord) => string;
  protected readonly dedupe: TelegramDedupeConfig | false;
  protected readonly pending = new Set<Promise<void>>();
  protected readonly buffer = new Map<string, DedupeBufferEntry>();

  constructor(opts: TelegramTransportOptions) {
    super();
    this.chatId = opts.chatId;
    this.timeout = opts.timeout ?? 120_000;
    this.customFormat = opts.format;
    this.dedupe = this.resolveDedupe(opts.dedupe);

    const api = new Api(opts.botToken);
    api.config.use(autoRetry({ maxRetryAttempts: 3, maxDelaySeconds: 60 }));
    this.api = api;
  }

  override async consume(log: LogRecord): Promise<void> {
    if (this.dedupe) {
      this.enqueue(log);
      return;
    }
    const task = this.sendText(this.formatMessage(log)).finally(() => {
      this.pending.delete(task);
    });
    this.pending.add(task);
    await task;
  }

  override async flush(): Promise<void> {
    await this.flushBuffer();
    await Promise.all([...this.pending]);
  }

  protected resolveDedupe(
    dedupe: boolean | TelegramDedupeOptions | undefined,
  ): TelegramDedupeConfig | false {
    if (dedupe === false) return false;
    const opts = dedupe === true || dedupe == null ? {} : dedupe;
    return {
      interval: opts.interval ?? 30_000,
      bindingKeys: opts.bindingKeys,
      fingerprint: opts.fingerprint,
    };
  }

  /** 组装待发送正文（自定义 `format` 优先） */
  protected formatMessage(log: LogRecord): string {
    return this.customFormat?.(log) ?? this.formatTelegramMessage(log);
  }

  /** 默认消息模板；子类可 override */
  protected formatTelegramMessage(log: LogRecord): string {
    let text = `[${log.level}] ${log.timestamp.toISOString()}\n${log.message}`;
    if (log.bindings) {
      text += `\n${JSON.stringify(log.bindings)}`;
    }
    if (log.exception?.stack) {
      text += `\n\n${log.exception.stack}`;
    } else if (log.exception) {
      text += `\n\n${log.exception.type}: ${log.exception.message}`;
    }
    if (text.length <= TELEGRAM_MESSAGE_MAX_LENGTH) return text;
    return `${text.slice(0, TELEGRAM_MESSAGE_MAX_LENGTH - 1)}…`;
  }

  protected formatBufferedMessage(log: LogRecord, count: number): string {
    let text = this.formatMessage(log);
    if (count > 1) {
      text += `\n(×${count})`;
    }
    if (text.length <= TELEGRAM_MESSAGE_MAX_LENGTH) return text;
    return `${text.slice(0, TELEGRAM_MESSAGE_MAX_LENGTH - 1)}…`;
  }

  /** 解析最终指纹（自定义 `fingerprint` 优先） */
  protected fingerprint(log: LogRecord): string {
    const dedupe = this.dedupe;
    if (!dedupe) {
      return this.fingerprintLog(log);
    }
    return dedupe.fingerprint?.(log) ?? this.fingerprintLog(log, dedupe.bindingKeys);
  }

  /**
   * 默认指纹：`level` + `message` + `exception`；
   * 传入 `bindingKeys` 时再附加对应 bindings。
   */
  protected fingerprintLog(
    log: LogRecord,
    bindingKeys?: TelegramDedupeBindingKeys,
  ): string {
    const parts: unknown[] = [log.level, log.message];
    if (log.exception) {
      parts.push(this.fingerprintException(log.exception));
    }
    if (log.bindings) {
      const picked = this.pickBindingsForFingerprint(log.bindings, bindingKeys);
      if (picked) {
        parts.push(picked);
      }
    }
    return JSON.stringify(parts);
  }

  protected fingerprintException(exception: SerializedError): unknown {
    return {
      type: exception.type,
      message: exception.message,
      stack: exception.stack,
      ...(exception.cause ? { cause: this.fingerprintException(exception.cause) } : {}),
    };
  }

  protected pickBindingsForFingerprint(
    bindings: Record<string, unknown>,
    bindingKeys: TelegramDedupeBindingKeys | undefined,
  ): Record<string, unknown> | undefined {
    if (bindingKeys == null) return undefined;
    const filtered: Record<string, unknown> = {};
    if (bindingKeys === 'all') {
      for (const key of Object.keys(bindings).sort()) {
        filtered[key] = bindings[key];
      }
    } else {
      for (const key of [...bindingKeys].sort()) {
        if (Object.hasOwn(bindings, key)) {
          filtered[key] = bindings[key];
        }
      }
    }
    return Object.keys(filtered).length > 0 ? filtered : undefined;
  }

  protected enqueue(log: LogRecord): void {
    const dedupe = this.dedupe;
    if (!dedupe) return;

    const fp = this.fingerprint(log);
    const existing = this.buffer.get(fp);
    if (existing) {
      existing.count += 1;
      return;
    }

    const timer = setTimeout(() => {
      void this.flushFingerprint(fp).catch((err) => {
        const detail = Error.isError(err) ? (err.stack ?? err.message) : String(err);
        console.error(`[aomex/logger-telegram] dedupe flush failed: ${detail}`);
      });
    }, dedupe.interval);
    timer.unref?.();
    this.buffer.set(fp, { log, count: 1, timer });
  }

  protected async flushBuffer(): Promise<void> {
    const fingerprints = [...this.buffer.keys()];
    await Promise.all(fingerprints.map((fp) => this.flushFingerprint(fp)));
  }

  protected async flushFingerprint(fp: string): Promise<void> {
    const entry = this.buffer.get(fp);
    if (!entry) return;
    clearTimeout(entry.timer);
    this.buffer.delete(fp);

    const task = this.sendText(
      this.formatBufferedMessage(entry.log, entry.count),
    ).finally(() => {
      this.pending.delete(task);
    });
    this.pending.add(task);
    await task;
  }

  protected async sendText(text: string): Promise<void> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      await this.api.sendMessage(
        this.chatId,
        text,
        { link_preview_options: { is_disabled: true } },
        // grammy 使用独立 AbortSignal 类型
        controller.signal as Parameters<Api['sendMessage']>[3],
      );
    } catch (err) {
      if (Error.isError(err) && err.name === 'AbortError') {
        throw new Error(i18n.t('send_message_timed_out'));
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}
