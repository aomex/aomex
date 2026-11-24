import {
  WebsocketHubAdapter,
  type WebsocketHubAdapterOptions,
  type WebsocketHubBroadcastOptions,
} from '../adapters/hub-adapter';

const EMPTY_ROOMS: ReadonlySet<string> = new Set();

export type MemoryHubOptions = WebsocketHubAdapterOptions;

/**
 * 进程内房间与广播（默认 `hub`）。
 * 多机请换 `@aomex/websocket-redis-hub`，不要与 Socket.IO Redis adapter 叠用。
 *
 * **投递语义：** at-most-once（本机扇出尽力写出）；详见 {@link WebsocketHubAdapter.broadcast}。
 *
 * ```ts
 * new MemoryHub({ fanoutBatchSize: 512 });
 * ```
 */
export class MemoryHub extends WebsocketHubAdapter {
  protected readonly online = new Set<string>();
  protected readonly rooms = new Map<string, Set<string>>();
  protected readonly clientRooms = new Map<string, Set<string>>();

  constructor(options: MemoryHubOptions = {}) {
    super(options);
  }

  override onInit(): void {}

  override onDestroy(): void {
    this.online.clear();
    this.rooms.clear();
    this.clientRooms.clear();
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
    for (const room of touched) {
      const members = this.rooms.get(room);
      members?.delete(clientId);
      if (members && members.size === 0) this.rooms.delete(room);
    }
    this.clientRooms.delete(clientId);
    this.online.delete(clientId);
    return touched;
  }

  override removeClient(clientId: string): void {
    this.forgetLocalClient(clientId);
  }

  override join(clientId: string, room: string): void {
    if (!this.online.has(clientId)) return;
    let members = this.rooms.get(room);
    if (!members) {
      members = new Set();
      this.rooms.set(room, members);
    }
    members.add(clientId);
    this.clientRooms.get(clientId)?.add(room);
  }

  override leave(clientId: string, room: string): void {
    const members = this.rooms.get(room);
    members?.delete(clientId);
    if (members && members.size === 0) this.rooms.delete(room);
    this.clientRooms.get(clientId)?.delete(room);
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
    await this.fanout(this.rooms.get(room), event, data, options?.exceptId, {
      scope: 'room',
      room,
    });
  }

  override async broadcastAll(
    event: string,
    data: unknown,
    options?: WebsocketHubBroadcastOptions,
  ): Promise<void> {
    await this.fanout(this.online, event, data, options?.exceptId, {
      scope: 'all',
    });
  }

  override stats() {
    return {
      online: this.online.size,
      rooms: this.rooms.size,
      subscribedRooms: 0,
    };
  }
}
