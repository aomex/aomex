/**
 * {@link WebsocketApp.stats} / Hub 拉式快照（本机视角，非集群汇总）。
 *
 * ```ts
 * const s = await ws.stats();
 * // { online: 12, rooms: 3, subscribedRooms: 3 }
 * ```
 */
export type WebsocketStats = {
  /** 本机当前连接数 */
  online: number;
  /** 本机非空房间数 */
  rooms: number;
  /**
   * 本机已订的房间 Pub/Sub 频道数。
   * `MemoryHub` 无总线，恒为 `0`；`RedisHub` 为实际 `SUBSCRIBE` 数。
   */
  subscribedRooms: number;
};

/**
 * {@link WebsocketApp} 可观测事件（本机视角，推式）。
 * 由关键路径采集，经构造参数 `onMetric` 交给用户上报；与 {@link WebsocketStats} 拉式快照互补。
 * 事件驱动、非定时：有连接、入站、扇出、发布等变化才回调。
 */
export type WebsocketMetricEvent =
  | {
      /** 连接数变化。接入或断开时推送本机当前在线数 */
      type: 'online';
      /** 本机当前连接数 */
      online: number;
    }
  | {
      /** 一条入站消息处理完。不含事件名和消息体，耗时不含失败后的错误帧 */
      type: 'inbound';
      /** 处理链是否跑完。处理器抛错为 `false` */
      ok: boolean;
      durationMs: number;
    }
  | {
      /** 本机扇出结束。房间或全员各一条；单个连接写失败不中断其余连接 */
      type: 'fanout';
      scope: 'room' | 'all';
      room?: string;
      /** 实际投递目标数（已排除 except） */
      targets: number;
      /** 写出失败的连接数。单连接失败不中断其余扇出 */
      failed: number;
      durationMs: number;
    }
  | {
      /** 发布到 Redis 总线。仅 RedisHub 产生，MemoryHub 没有这条 */
      type: 'publish';
      ok: boolean;
      scope: 'room' | 'all';
      room?: string;
      durationMs?: number;
    }
  | {
      /** 房间频道订阅成功 */
      type: 'subscribe';
      room: string;
      /** 本机当前已订房间频道数 */
      subscribedRooms: number;
    }
  | {
      /** 房间无人后取消频道订阅 */
      type: 'unsubscribe';
      room: string;
      subscribedRooms: number;
    };

export type WebsocketMetricHandler = (event: WebsocketMetricEvent) => void;
