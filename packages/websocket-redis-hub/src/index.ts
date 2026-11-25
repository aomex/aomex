import { Redis, type RedisOptions } from 'ioredis';
import {
  WebsocketHubAdapter,
  type WebsocketHubAdapterOptions,
  type WebsocketHubBroadcastOptions,
} from '@aomex/websocket';
import { i18n } from './i18n';

const EMPTY_ROOMS: ReadonlySet<string> = new Set();
const DEFAULT_CHANNEL_PREFIX = 'aomex:websocket:hub';

/** Pub/Sub 载荷（房间名由 Redis channel 携带，全员频道无 room） */
type BusMessage = {
  event: string;
  data: unknown;
  exceptId?: string;
};

export type { RedisOptions };

/**
 * Redis Hub 选项：透传 `ioredis` 连接配置，并入 Hub 公共项与频道前缀。
 *
 * ```ts
 * new RedisHub({
 *   host: '127.0.0.1',
 *   port: 6379,
 *   channel: 'aomex:websocket:hub',
 *   fanoutBatchSize: 512,
 * });
 * ```
 */
export type RedisHubOptions = RedisOptions &
  WebsocketHubAdapterOptions & {
    /**
     * Pub/Sub 频道前缀。默认：`aomex:websocket:hub`。
     * 实际频道：`{prefix}:a`（全员）、`{prefix}:r:{room}`（单房）。
     * 多应用共用一个 Redis 时请改成互不冲突的前缀。
     */
    channel?: string;
  };

/**
 * 多机房间与广播：本机维护连接/房间表，跨节点经 Redis Pub/Sub 扇出。
 *
 * - 一房间一频道（对齐常见 backplane）：有成员才 `SUBSCRIBE`，成员清空才 `UNSUBSCRIBE`
 * - 订阅往返期间成员若变化，会按当前成员再对齐一次，避免有人在房但本机已退订
 * - 全员广播走独立频道 `{prefix}:a`
 * - **投递语义：** at-most-once；`PUBLISH` 成功 ≠ 各节点已扇出完毕 ≠ 对端已收；无 ack / 离线补发
 * - 与传输层正交；不要叠 Socket.IO 自带 Redis adapter
 * - 断线重连后只把这次真正 `SUBSCRIBE` 成功的房间标成已订
 * - 生命周期由 {@link WebsocketHub} 经 `ensureReady` 触发
 *
 * ```ts
 * import { WebsocketApp, channels } from '@aomex/websocket';
 * import { WsTransport } from '@aomex/websocket-ws-transport';
 * import { RedisHub } from '@aomex/websocket-redis-hub';
 *
 * const ws = new WebsocketApp({
 *   logger,
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
export class RedisHub extends WebsocketHubAdapter {
  protected readonly redis: Redis;
  protected readonly sub: Redis;
  protected readonly allChannel: string;
  protected readonly roomChannelPrefix: string;
  protected closed = false;
  protected subscriberBound = false;
  /**
   * 本机已订的房间名（全员频道不记在这里）。
   * 为 true 的前提：当前这条订阅连接上 `SUBSCRIBE` 已返回，且之后没有断线。
   * 断线会使服务端订阅全部失效，必须和 {@link subscriptionEpoch} 一起清掉。
   */
  protected readonly subscribedRooms = new Set<string>();
  /**
   * 订阅连接代数。`close` / `end` 时加一。
   * 命令返回后代数变了，说明它落在已经断开的连接上，结果不能写回 `subscribedRooms`。
   */
  protected subscriptionEpoch = 0;
  protected resubscribePromise?: Promise<void>;
  /**
   * 每个房间正在进行的订阅对齐。
   * `again`：等待 Redis 期间有人进出，或订阅连接断了，当前这一轮结束后再对齐一次。
   */
  protected readonly roomSyncs = new Map<
    string,
    { again: boolean; promise: Promise<void> }
  >();

  protected readonly online = new Set<string>();
  protected readonly rooms = new Map<string, Set<string>>();
  protected readonly clientRooms = new Map<string, Set<string>>();

  constructor(options: RedisHubOptions = {}) {
    const {
      channel = DEFAULT_CHANNEL_PREFIX,
      fanoutBatchSize,
      ...redisOptions
    } = options;
    super({ fanoutBatchSize });
    this.allChannel = `${channel}:a`;
    this.roomChannelPrefix = `${channel}:r:`;
    this.redis = new Redis({ ...redisOptions, lazyConnect: true });
    this.sub = new Redis({ ...redisOptions, lazyConnect: true });
  }

  override async onInit(): Promise<void> {
    if (this.closed) return;
    this.bindSubscriber();
    if (this.redis.status === 'wait') {
      await this.redis.connect();
    }
    if (this.closed) return;
    if (this.sub.status === 'wait') {
      await this.sub.connect();
    }
    if (this.closed) return;
    await this.resyncSubscriptions();
  }

  override addClient(clientId: string): void {
    this.online.add(clientId);
    if (!this.clientRooms.has(clientId)) {
      this.clientRooms.set(clientId, new Set());
    }
  }

  protected override forgetLocalClient(clientId: string): readonly string[] {
    const joined = this.clientRooms.get(clientId);
    const touched = joined ? [...joined] : [];
    for (const room of touched) this.dropMember(clientId, room);
    this.clientRooms.delete(clientId);
    this.online.delete(clientId);
    return touched;
  }

  override async removeClient(clientId: string): Promise<void> {
    const touched = this.forgetLocalClient(clientId);
    await Promise.all(
      touched.map((room) =>
        this.syncRoom(room).catch((err: unknown) => {
          // 人已离开；订阅失败留待下次进房再对齐
          void this.logger.warn(err, i18n.t('sync_room_failed', { room }));
        }),
      ),
    );
  }

  override async join(clientId: string, room: string): Promise<void> {
    if (!this.online.has(clientId)) return;
    let members = this.rooms.get(room);
    if (!members) {
      members = new Set();
      this.rooms.set(room, members);
    }
    const already = members.has(clientId);
    // 先写入成员再 SUBSCRIBE。ack 回来时人已经在集合里，本机扇出才能带上他。
    // 等订阅成功再写入的话，ack 到写入之间的广播会漏掉这个人。
    members.add(clientId);
    this.clientRooms.get(clientId)?.add(room);
    try {
      await this.syncRoom(room);
    } catch (err) {
      // 这次新加的人必须撤回。人留在房间里、频道又没订上时，只有下次再进这个房间才会重试。
      // 调用方如果不再 join，广播会一直丢，房间表里还留着一个其实没订上的人。
      // 本来就在房里的人不撤：一次失败不能把原有成员踢掉，下次进房或重连会再订。
      if (!already) this.dropMember(clientId, room);
      throw err;
    }
  }

  override async leave(clientId: string, room: string): Promise<void> {
    this.dropMember(clientId, room);
    await this.syncRoom(room).catch((err: unknown) => {
      // 人已离开；订阅失败留待下次进房再对齐
      void this.logger.warn(err, i18n.t('sync_room_failed', { room }));
    });
  }

  override getClientRooms(clientId: string): ReadonlySet<string> {
    return this.clientRooms.get(clientId) ?? EMPTY_ROOMS;
  }

  override async broadcast(
    room: string,
    event: string,
    data: unknown,
    options?: WebsocketHubBroadcastOptions,
  ): Promise<void> {
    const message: BusMessage = {
      event,
      data,
      exceptId: options?.exceptId,
    };
    await this.publishBus(this.roomChannel(room), JSON.stringify(message), {
      scope: 'room',
      room,
    });
  }

  override async broadcastAll(
    event: string,
    data: unknown,
    options?: WebsocketHubBroadcastOptions,
  ): Promise<void> {
    const message: BusMessage = {
      event,
      data,
      exceptId: options?.exceptId,
    };
    await this.publishBus(this.allChannel, JSON.stringify(message), {
      scope: 'all',
    });
  }

  override stats() {
    return {
      online: this.online.size,
      rooms: this.rooms.size,
      subscribedRooms: this.subscribedRooms.size,
    };
  }

  /**
   * 关闭 pub/sub 连接（幂等）。未 `ensureReady` 过则只断开惰性客户端。
   */
  override async onDestroy(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    this.invalidateSubscriptions();
    this.roomSyncs.clear();
    if (this.readyPromise) {
      await this.readyPromise.catch((err: unknown) => {
        void this.logger.warn(err, i18n.t('destroy_ready_failed'));
      });
    }
    this.sub.disconnect();
    this.redis.disconnect();
  }

  /** `{prefix}:r:{room}` */
  protected roomChannel(room: string): string {
    return `${this.roomChannelPrefix}${room}`;
  }

  /**
   * 绑定订阅连接事件（只绑一次）。
   */
  protected bindSubscriber(): void {
    if (this.subscriberBound) return;
    this.subscriberBound = true;

    this.sub.on('message', (ch, raw) => {
      if (this.closed) return;
      this.onBusMessage(ch, raw);
    });

    this.sub.on('close', () => {
      this.invalidateSubscriptions();
    });

    this.sub.on('end', () => {
      this.invalidateSubscriptions();
    });

    this.sub.on('ready', () => {
      if (this.closed) return;
      void this.resyncSubscriptions().catch((err: unknown) => {
        void this.logger.error(err, i18n.t('resync_failed'));
      });
    });
  }

  /**
   * 订阅连接断开。服务端会丢掉这条连接上的全部 SUBSCRIBE，本地标记必须一起作废。
   *
   * 代数加一，让还在等命令返回的对齐看到「这是旧连接」后停止写标记。
   * 同时丢掉重连占位：旧一轮的 `finally` 只在占位仍是自己时才清空，
   * 避免它把 `ready` 已经放进去的新一轮重连清掉，两轮一起改 `subscribedRooms`。
   */
  protected invalidateSubscriptions(): void {
    this.subscriptionEpoch += 1;
    this.subscribedRooms.clear();
    this.resubscribePromise = undefined;
  }

  /**
   * 按本机状态重新订阅全员频道 + 有人的房间（重连 / onInit）。
   * 进行中的一轮被复用；断线后 {@link invalidateSubscriptions} 会把占位丢掉，下一轮从新代数开始。
   */
  protected resyncSubscriptions(): Promise<void> {
    if (this.closed) return Promise.resolve();
    const current = this.resubscribePromise;
    if (current) return current;

    const epoch = this.subscriptionEpoch;
    const task = this.restoreSubscriptions(epoch).finally(() => {
      if (this.resubscribePromise === task) this.resubscribePromise = undefined;
    });
    this.resubscribePromise = task;
    return task;
  }

  /**
   * 重连后的订阅恢复。标记只跟着 `syncRoom` 走，不在订阅返回后按房间表整表写回。
   *
   * 若在 `await` 之后把 `this.rooms` 里的房间全部标成已订，等待期间新进的房间
   * 不在这次 `SUBSCRIBE` 列表里，却会显示已订。随后 `syncRoom` 看到已订就直接返回，
   * Redis 上没有这个频道，本机扇出只走 Pub/Sub 回调，广播会静默丢失。
   */
  protected async restoreSubscriptions(epoch: number): Promise<void> {
    if (this.closed || epoch !== this.subscriptionEpoch) return;

    await this.sub.subscribe(this.allChannel);
    if (this.closed || epoch !== this.subscriptionEpoch) return;

    // 第二轮补上第一轮等待期间才出现、并且自己的 syncRoom 还没写上标记的房间。
    // 成员自己的 join 也会等 syncRoom，所以这里漏掉的一轮不会留下「有人但没订」。
    for (let pass = 0; pass < 2; pass++) {
      if (this.closed || epoch !== this.subscriptionEpoch) return;
      const pending = [...this.rooms.keys()].filter(
        (room) => !this.subscribedRooms.has(room),
      );
      if (pending.length === 0) return;
      await Promise.all(
        pending.map((room) =>
          this.syncRoom(room).catch((err: unknown) => {
            // 单个房间失败保持未订，下次 join 或下一次 ready 再对齐
            void this.logger.warn(err, i18n.t('sync_room_failed', { room }));
          }),
        ),
      );
    }
  }

  /** 从本机房间表移除成员；表空则删房间。不触碰 Redis。 */
  protected dropMember(clientId: string, room: string): void {
    const members = this.rooms.get(room);
    if (members) {
      members.delete(clientId);
      if (members.size === 0) this.rooms.delete(room);
    }
    this.clientRooms.get(clientId)?.delete(room);
  }

  /**
   * 把该房间的 Redis 订阅对齐到当前成员。同一房间串行，避免订、退两条命令交叉。
   *
   * `again` 表示这一轮 Redis 命令还在飞时，对齐条件已经变了，结束后必须再看一次：
   * - 有人进出。退订尚未返回时 `subscribedRooms` 仍是 true，新成员若据此跳过 SUBSCRIBE，
   *   退订完成后 Redis 上没有频道、人却还在，之后的广播会静默丢失。
   * - 订阅连接断了。命令落在旧连接上，不能把房间标成已订，要在新连接上再订一次。
   */
  protected syncRoom(room: string): Promise<void> {
    const existing = this.roomSyncs.get(room);
    if (existing) {
      existing.again = true;
      return existing.promise;
    }

    const state = {
      again: false,
      promise: Promise.resolve(),
    };
    state.promise = (async () => {
      do {
        // 先清掉 again，等待期间的进出房或断线会再把它设上。
        state.again = false;
        const connectionDropped = await this.reconcileRoom(room);
        if (connectionDropped) state.again = true;
      } while (state.again && !this.closed);
    })().finally(() => {
      // 断线或关停可能已经把表清掉并放进了新一轮对齐，不能删掉那一轮。
      if (this.roomSyncs.get(room) === state) this.roomSyncs.delete(room);
    });
    this.roomSyncs.set(room, state);
    return state.promise;
  }

  /**
   * 单次对齐：有人且未订则订阅，无人且已订则退订。
   * 返回 true 表示等待期间连接断过，调用方要再对齐一次。
   *
   * `subscribedRooms` 只在命令返回且 {@link subscriptionEpoch} 没变时修改。
   * 命令刚发出就改标记的话，断线重连会把「本地已订」和「服务端没订上」拆开。
   */
  protected async reconcileRoom(room: string): Promise<boolean> {
    if (this.closed) return false;

    const epoch = this.subscriptionEpoch;
    const channel = this.roomChannel(room);
    const hasMembers = (this.rooms.get(room)?.size ?? 0) > 0;
    const subscribed = this.subscribedRooms.has(room);

    if (hasMembers && !subscribed) {
      await this.sub.subscribe(channel);
      if (this.closed) return false;
      if (this.subscriptionEpoch !== epoch) return true;
      this.subscribedRooms.add(room);
      this.reportMetric({
        type: 'subscribe',
        room,
        subscribedRooms: this.subscribedRooms.size,
      });
      return false;
    }

    if (!hasMembers && subscribed) {
      try {
        await this.sub.unsubscribe(channel);
      } catch {
        // 已断开时忽略。标记仍要清掉，避免一直认为这个房间还订着。
      }
      if (this.subscriptionEpoch !== epoch) return true;
      this.subscribedRooms.delete(room);
      if (this.closed) return false;
      this.reportMetric({
        type: 'unsubscribe',
        room,
        subscribedRooms: this.subscribedRooms.size,
      });
    }
    return false;
  }

  protected async publishBus(
    redisChannel: string,
    raw: string,
    meta: { scope: 'room' | 'all'; room?: string },
  ): Promise<void> {
    if (this.closed) {
      throw new Error(i18n.t('hub_closed'));
    }
    const started = performance.now();
    try {
      await this.redis.publish(redisChannel, raw);
      this.reportMetric({
        type: 'publish',
        ok: true,
        scope: meta.scope,
        room: meta.room,
        durationMs: performance.now() - started,
      });
    } catch (err) {
      this.reportMetric({
        type: 'publish',
        ok: false,
        scope: meta.scope,
        room: meta.room,
        durationMs: performance.now() - started,
      });
      throw err;
    }
  }

  protected onBusMessage(ch: string, raw: string): void {
    let message: BusMessage;
    try {
      message = JSON.parse(raw) as BusMessage;
    } catch {
      return;
    }
    if (!message || typeof message !== 'object') return;
    if (typeof message.event !== 'string') return;

    if (ch === this.allChannel) {
      void this.fanout(this.online, message.event, message.data, message.exceptId, {
        scope: 'all',
      }).catch((err: unknown) => {
        // 总线回调没有 await。扇出内部已按连接记日志；这里接住扇出自身的拒绝。
        void this.logger.error(err, i18n.t('bus_fanout_failed'));
      });
      return;
    }

    if (ch.startsWith(this.roomChannelPrefix)) {
      const room = ch.slice(this.roomChannelPrefix.length);
      if (!room) return;
      void this.fanout(
        this.rooms.get(room),
        message.event,
        message.data,
        message.exceptId,
        { scope: 'room', room },
      ).catch((err: unknown) => {
        // 同上：单连接写失败不能冒泡到 Pub/Sub 回调外面。
        void this.logger.error(err, i18n.t('bus_fanout_failed'));
      });
    }
  }
}
