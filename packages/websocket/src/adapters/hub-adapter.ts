import { registerLifecycle } from '@aomex/common';
import type { WebApp } from '@aomex/web';
import { i18n } from '../i18n';
import type {
  WebsocketMetricEvent,
  WebsocketMetricHandler,
  WebsocketStats,
} from '../core/metric';

/**
 * Hub 向本机连接投递出站消息（由 {@link WebsocketHub} 注入）。
 * 分布式 Hub 实现在收到总线消息后也应调用此回调。
 */
export type WebsocketHubDeliver = (
  clientId: string,
  event: string,
  data: unknown,
) => void | Promise<void>;

export interface WebsocketHubBroadcastOptions {
  exceptId?: string;
}

/** {@link WebsocketHubAdapter.fanout} 的可选上下文（供指标） */
export interface WebsocketHubFanoutMeta {
  scope: 'room' | 'all';
  room?: string;
}

/** Hub 适配器公共配置（各具体 Hub 构造参数会并入） */
export interface WebsocketHubAdapterOptions {
  /**
   * 本机扇出每批并发 `deliver` 数。默认：`256`。
   * 批与批之间 `setImmediate` 让出事件循环，避免大房间一次打满单轮调度。
   *
   * ```ts
   * new MemoryHub({ fanoutBatchSize: 512 });
   * new RedisHub({ host: '127.0.0.1', fanoutBatchSize: 128 });
   * ```
   */
  fanoutBatchSize?: number;
}

const DEFAULT_FANOUT_BATCH_SIZE = 256;

/**
 * 房间成员与广播扇出（配置项 `hub`，与传输层 `transport` 正交）。
 *
 * - 单机：默认 {@link MemoryHub}
 * - 多机：`@aomex/websocket-redis-hub`（本机房间表 + Redis Pub/Sub）
 * - 首次 {@link ensureReady} 时登记生命周期；子类实现 `onInit` / `onDestroy`
 * - 成员与广播相关方法均可异步；Hub / `ctx.client` 会 await
 * - 本机扇出经 {@link fanout} 分片，批次由构造参数 {@link WebsocketHubAdapterOptions.fanoutBatchSize} 配置
 *
 * ```ts
 * import { RedisHub } from '@aomex/websocket-redis-hub';
 *
 * const ws = new WebsocketApp({
 *   logger: services.logger,
 *   language: { mode: 'fixed', language: 'zh-CN' },
 *   transport: new WsTransport(),
 *   hub: new RedisHub({ host: '127.0.0.1', port: 6379, fanoutBatchSize: 512 }),
 *   mount: [channels('./src/channels')],
 * });
 * const server = web.http({});
 * ws.attach(web, server);
 * server.listen(3000);
 * ```
 */
export abstract class WebsocketHubAdapter {
  protected readyPromise?: Promise<void>;
  protected deliver: WebsocketHubDeliver = () => {};
  protected metricHandler?: WebsocketMetricHandler;
  /** 由 {@link WebsocketApp} 在构造时注入的应用日志 */
  protected logger!: WebApp.Logger;
  /** 本机扇出批次，构造时解析；非法值回退默认 */
  protected readonly fanoutBatchSize: number;

  constructor(options: WebsocketHubAdapterOptions = {}) {
    this.fanoutBatchSize = this.resolveFanoutBatchSize(options.fanoutBatchSize);
  }

  /**
   * 确保已完成生命周期 `onInit`（可重入，多次调用共享同一次初始化）。
   * 由 {@link WebsocketHub} 在接入、进房、退房和广播前调用，子类不必再调。
   */
  ensureReady(): Promise<void> {
    this.readyPromise ??= registerLifecycle({
      onInit: () => this.onInit(),
      onDestroy: () => this.onDestroy(),
    }).then(() => undefined);
    return this.readyPromise;
  }

  /**
   * 由 Hub 绑定本机投递；子类在 `broadcast` / 订阅回调里调用 `this.deliver`。
   */
  bind(deliver: WebsocketHubDeliver): void {
    this.deliver = deliver;
  }

  /**
   * 由 {@link WebsocketApp} / {@link WebsocketHub} 注入指标回调。
   */
  bindMetric(handler: WebsocketMetricHandler): void {
    this.metricHandler = handler;
  }

  /** 由 {@link WebsocketApp} 注入应用日志。后台失败都写到这里。 */
  bindLogger(logger: WebApp.Logger): void {
    this.logger = logger;
  }

  /**
   * 上报指标；回调抛错只记日志，不影响主路径。
   */
  protected reportMetric(event: WebsocketMetricEvent): void {
    try {
      this.metricHandler?.(event);
    } catch (err) {
      void this.logger.warn(err, i18n.t('metric_handler_failed'));
    }
  }

  /**
   * 对本机成员分片扇出（供 `broadcast` / 总线回调使用）。
   * `members` 为空或未定义时直接返回。
   */
  protected async fanout(
    members: ReadonlySet<string> | undefined,
    event: string,
    data: unknown,
    exceptId?: string,
    meta?: WebsocketHubFanoutMeta,
  ): Promise<void> {
    if (!members || members.size === 0) return;
    const started = performance.now();
    const batchSize = this.fanoutBatchSize;
    const batch: Array<void | Promise<void>> = [];
    let targets = 0;
    let failed = 0;
    let sample: unknown;
    for (const id of members) {
      if (exceptId !== undefined && id === exceptId) continue;
      targets += 1;
      batch.push(
        Promise.resolve()
          .then(() => this.deliver(id, event, data))
          .catch((err: unknown) => {
            // 单个连接写失败不中断其余扇出。整批结束后汇总一条日志，避免按连接刷屏。
            failed += 1;
            if (sample === undefined) sample = err;
          }),
      );
      if (batch.length >= batchSize) {
        await Promise.all(batch);
        batch.length = 0;
        await new Promise<void>((resolve) => setImmediate(resolve));
      }
    }
    if (batch.length > 0) {
      await Promise.all(batch);
    }
    if (failed > 0) {
      void this.logger.warn(sample, i18n.t('fanout_deliver_failed', { failed }));
    }
    this.reportMetric({
      type: 'fanout',
      scope: meta?.scope ?? 'room',
      room: meta?.room,
      targets,
      failed,
      durationMs: performance.now() - started,
    });
  }

  protected resolveFanoutBatchSize(value: number | undefined): number {
    if (value === undefined) return DEFAULT_FANOUT_BATCH_SIZE;
    if (!Number.isFinite(value) || value <= 0) return DEFAULT_FANOUT_BATCH_SIZE;
    return Math.floor(value);
  }

  /**
   * 生命周期初始化（如建立外部连接）。由 {@link ensureReady} 触发。
   */
  abstract onInit(): void | Promise<void>;

  /**
   * 释放 Hub 资源（幂等）。进程关停时由生命周期自动调用。
   */
  abstract onDestroy(): void | Promise<void>;

  /** 本机连接上线（供 `broadcastAll` 与成员表） */
  abstract addClient(clientId: string): void | Promise<void>;

  /**
   * 同步从本机在线表和房间表拿掉连接，返回它曾加入的房间。
   * 不访问外部存储，也不抛错。`removeClient` 在清表之前失败时，Hub 会再调一次，
   * 避免人还留在成员表里、之后的广播仍算上他。
   */
  protected abstract forgetLocalClient(clientId: string): readonly string[];

  /**
   * 本机连接下线：先 {@link forgetLocalClient}，再做远程退订等收尾。
   */
  abstract removeClient(clientId: string): void | Promise<void>;

  /** 加入房间；分布式实现应在 Promise resolve 后保证成员可见 */
  abstract join(clientId: string, room: string): void | Promise<void>;

  abstract leave(clientId: string, room: string): void | Promise<void>;

  /** 查询连接已加入的房间；分布式下可能读远程存储 */
  abstract getClientRooms(
    clientId: string,
  ): ReadonlySet<string> | Promise<ReadonlySet<string>>;

  /**
   * 房间广播。
   *
   * **投递语义（at-most-once）：**
   * - Promise resolve = 本机已扇出写出，或已 `PUBLISH` 到总线
   * - **不保证**对端已收到、离线补发、ack、全集群有序
   * - 断线 / 慢客户端可能导致丢消息；需确认请走业务事件或落库
   */
  abstract broadcast(
    room: string,
    event: string,
    data: unknown,
    options?: WebsocketHubBroadcastOptions,
  ): void | Promise<void>;

  /**
   * 全员广播。语义同 {@link broadcast}（at-most-once）；
   * 分布式下通常走独立全员频道，而非扫所有房间频道。
   */
  abstract broadcastAll(
    event: string,
    data: unknown,
    options?: WebsocketHubBroadcastOptions,
  ): void | Promise<void>;

  /**
   * 本机成员与订阅快照（供 {@link WebsocketApp.stats} / 探针 scrape）。
   * `online` 以适配器成员表为准；App 侧会再与传输连接表对齐。
   */
  abstract stats(): WebsocketStats | Promise<WebsocketStats>;
}
