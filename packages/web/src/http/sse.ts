import type { WebContext } from './context';

export namespace ServerSentEvents {
  export interface Options {
    /**
     * 心跳间隔（毫秒）。写入 SSE 注释行以保持连接。
     * 默认：`15000`。设为 `0` 或 `false` 关闭心跳。
     */
    heartbeat?: number | false;
    /**
     * 写入 `retry:` 字段，提示客户端重连间隔（毫秒）
     */
    retry?: number;
  }

  export interface Message {
    /**
     * 对应帧里的 `data:`。非字符串会 `JSON.stringify`；含换行时拆成多行 `data:`。
     */
    data?: unknown;
    /**
     * 对应帧里的 `event:`。不写时浏览器走默认的 `message` 事件
     *（`EventSource#onmessage` / `addEventListener('message', ...)`）。
     */
    event?: string;
    /**
     * 对应帧里的 `id:`。浏览器会记住最后一次 id，重连时通过请求头 `Last-Event-ID` 带回，
     * 服务端可用 `sse.lastEventId` 读取以做断点续传。
     */
    id?: string;
    /**
     * 对应帧里的 `retry:`（毫秒）。更新客户端断线后的重连间隔。
     */
    retry?: number;
  }
}

export class ServerSentEvents {
  protected closed = false;
  protected readonly teardowns: Array<() => void> = [];
  protected readonly abortController = new AbortController();
  protected readonly heartbeatTimer?: ReturnType<typeof setInterval>;

  constructor(
    protected readonly ctx: WebContext,
    options: ServerSentEvents.Options = {},
  ) {
    const { response, request } = ctx;

    if (response.headersSent) {
      throw new Error('ServerSentEvents: response headers already sent');
    }

    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    response.setHeader('Cache-Control', 'no-cache, no-transform');
    response.setHeader('Connection', 'keep-alive');
    // Nginx 专用：关掉代理缓冲，否则事件会被攒住（非 HTTP/SSE 标准头）
    response.setHeader('X-Accel-Buffering', 'no');
    // 流式推送长度未知，避免固定 Content-Length
    response.removeHeader('Content-Length');
    response.flushHeaders();

    if (options.retry != null) {
      this.writeField('retry', String(options.retry));
      this.writeRaw('\n');
    }

    const heartbeat = options.heartbeat === false ? 0 : (options.heartbeat ?? 15_000);
    if (heartbeat > 0) {
      this.heartbeatTimer = setInterval(() => {
        this.writeRaw(': \n\n');
      }, heartbeat);
      // 不阻止进程退出
      this.heartbeatTimer.unref?.();
    }

    const onClose = () => this.close();
    request.on('close', onClose);
    response.on('close', onClose);
    this.teardowns.push(() => {
      request.off('close', onClose);
      response.off('close', onClose);
    });
  }

  /**
   * 客户端带来的 `Last-Event-ID`（若有）。
   * 发送事件时带上 `id` 后，浏览器断线重连会自动带上该请求头；首次连接或未发过 id 时为 `undefined`。
   *
   * ```typescript
   * const sse = ctx.sse();
   * const after = sse.lastEventId;
   * await sse.stream(async (emit, signal) => {
   *   for await (const item of events.watch({ after, signal })) {
   *     emit({ id: String(item.id), data: item });
   *   }
   * });
   * ```
   */
  get lastEventId(): string | undefined {
    const value = this.ctx.request.headers['last-event-id'];
    if (Array.isArray(value)) return value[0] || undefined;
    return value || undefined;
  }

  /**
   * 与本连接绑定的 `AbortSignal`。连接 `close`（含客户端断开）时会 abort，
   * 可传给异步源（如 `watch({ signal })`）以便自动取消；`stream` 的第二参数是同一个 signal。
   */
  get signal(): AbortSignal {
    return this.abortController.signal;
  }

  protected get writable(): boolean {
    return !this.closed && this.ctx.response.writable;
  }

  /**
   * 发送一条 SSE 事件
   */
  send(message: ServerSentEvents.Message): void {
    if (!this.writable) return;

    const chunks: string[] = [];
    if (message.id != null) {
      chunks.push(`id: ${this.escapeBreak(String(message.id))}\n`);
    }
    if (message.event != null) {
      chunks.push(`event: ${this.escapeBreak(String(message.event))}\n`);
    }
    if (message.retry != null) chunks.push(`retry: ${Number(message.retry)}\n`);
    if (message.data !== void 0) {
      const raw =
        typeof message.data === 'string' ? message.data : JSON.stringify(message.data);
      for (const line of raw.split(/\r?\n/)) {
        chunks.push(`data: ${line}\n`);
      }
    }
    chunks.push('\n');
    this.writeRaw(chunks.join(''));
  }

  /**
   * 连接关闭时回调（若已关闭则立即执行）
   */
  onClose(fn: () => void): this {
    if (this.closed) {
      fn();
    } else {
      this.teardowns.push(fn);
    }
    return this;
  }

  /**
   * 跟随异步源推送；结束或中断时自动 `close()`。
   * 第二参数 `signal` 即 `this.signal`，连接关闭时 abort。
   */
  async stream(
    fn: (
      emit: (message: ServerSentEvents.Message) => void,
      signal: AbortSignal,
    ) => void | Promise<void>,
  ): Promise<void> {
    try {
      await fn((message) => this.send(message), this.signal);
    } finally {
      this.close();
    }
  }

  /**
   * 结束 SSE 连接并执行 teardown。
   *
   * 客户端断开或 request/response `close` 时会自动调用，一般不必手动关；
   * 服务端主动收尾（推送结束、`stream` 跑完）时再调用。
   */
  close(): void {
    if (this.closed) return;
    this.closed = true;

    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (!this.abortController.signal.aborted) {
      this.abortController.abort();
    }

    const tasks = this.teardowns.splice(0);
    for (const task of tasks) {
      try {
        task();
      } catch {
        // teardown 失败不影响关流
      }
    }

    const { response } = this.ctx;
    if (response.writable) {
      response.end();
    }
  }

  protected writeField(name: string, value: string): void {
    this.writeRaw(`${name}: ${this.escapeBreak(value)}\n`);
  }

  protected writeRaw(chunk: string): void {
    if (this.closed) return;
    const { response } = this.ctx;
    if (!response.writable) {
      this.close();
      return;
    }
    response.write(chunk);
  }

  protected escapeBreak(value: string): string {
    return value.replace(/[\r\n]/g, '');
  }
}
