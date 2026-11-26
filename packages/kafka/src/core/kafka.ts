import {
  compose,
  middleware,
  parseDuration,
  Service,
  validate,
  type ComposeFn,
  type DurationInput,
  type ValidatorToken,
} from '@aomex/common';
import {
  getFileValues,
  pathToFiles,
  type GlobPathOptions,
} from '@aomex/internal-file-import';
import type { Logger } from '@aomex/logger';
import { KafkaJS } from '@confluentinc/kafka-javascript';
import type { ConnectionOptions } from 'node:tls';
import { KafkaConsumer } from './consumer';
import { i18n } from '../i18n';
import type { KafkaMiddlewareToken } from '../override';
import type { KafkaTopic } from './topic';
import '../override/kafka-middleware.js';

type Consumption = {
  resolve: () => void;
  reject: (error: unknown) => void;
  settled: boolean;
};

type WireMessage = {
  value: Buffer;
  key?: string;
  headers?: Record<string, string>;
  partition?: number;
};

type RecordMetadata = KafkaJS.RecordMetadata;

type ConsumerEvents = {
  CRASH: string;
  STOP: string;
};

type CrashListener = (event: { payload: { restart?: boolean; error?: unknown } }) => void;

type KafkaConsumerClient = KafkaJS.Consumer & {
  events?: ConsumerEvents;
  on?(event: string, listener: CrashListener): () => void;
};

type BoundHandler = {
  rule: ValidatorToken;
  route: ComposeFn;
};

type Subscription = {
  groupId: string;
  each: Record<string, BoundHandler>;
};

type Resolved = {
  brokers: readonly string[];
  clientId: string;
  logger: Logger;
  mount: readonly KafkaMiddlewareToken[];
  ssl?: Kafka.Ssl;
  sasl?: Kafka.Sasl;
  connectionTimeout?: number;
  requestTimeout?: number;
  allowAutoTopicCreation: boolean;
  idempotent: boolean;
  acks: -1 | 0 | 1;
  maxMessageBytes: number;
  sessionTimeout: number;
  heartbeatInterval: number;
  encode?: (value: unknown) => Buffer;
  decode?: (buffer: Buffer) => unknown;
};

/** 解析成毫秒。客户端只接受整数。 */
function durationMs(value: DurationInput): number {
  return Math.round(parseDuration(value));
}

/** 配置在工厂里校验一次。`combineServices` 只能 `new Ctor()`，所以结果是零参类。 */
function resolveOptions(options: Kafka.Options<KafkaMiddlewareToken[] | []>): Resolved {
  if (options.brokers.length === 0) {
    throw new Error(i18n.t('empty_brokers'));
  }
  const brokers: string[] = [];
  for (const broker of options.brokers) {
    if (broker.length === 0) {
      throw new Error(i18n.t('empty_broker'));
    }
    brokers.push(broker);
  }
  const idempotent = options.idempotent ?? true;
  const acks = options.acks ?? -1;
  if (idempotent && acks !== -1) {
    throw new Error(i18n.t('idempotent_requires_all_acks'));
  }
  const sessionTimeout = durationMs(options.sessionTimeout ?? '30s');
  const heartbeatInterval =
    options.heartbeatInterval === undefined
      ? Math.min(durationMs('3s'), Math.max(1, Math.floor(sessionTimeout / 3)))
      : durationMs(options.heartbeatInterval);
  if (heartbeatInterval > 0 && heartbeatInterval >= sessionTimeout) {
    throw new Error(i18n.t('heartbeat_exceeds_session'));
  }
  if (options.clientId.length === 0) {
    throw new Error(i18n.t('empty_client_id'));
  }
  return {
    brokers,
    clientId: options.clientId,
    logger: options.logger,
    mount: options.mount ?? [],
    ...(options.ssl === undefined ? {} : { ssl: options.ssl }),
    ...(options.sasl === undefined ? {} : { sasl: options.sasl }),
    ...(options.connectionTimeout === undefined
      ? {}
      : { connectionTimeout: durationMs(options.connectionTimeout) }),
    ...(options.requestTimeout === undefined
      ? {}
      : { requestTimeout: durationMs(options.requestTimeout) }),
    allowAutoTopicCreation: options.allowAutoTopicCreation ?? false,
    idempotent,
    acks,
    maxMessageBytes: options.maxMessageBytes ?? 1_048_576,
    sessionTimeout,
    heartbeatInterval,
    ...(options.encode === undefined
      ? {}
      : { encode: options.encode as (value: unknown) => Buffer }),
    ...(options.decode === undefined ? {} : { decode: options.decode }),
  };
}

/**
 * 创建 Kafka 服务类，交给 `combineServices`。
 *
 * 同一个类同时给 Web 与 Console 用：Web 里 `produce`，Console 指令里 `consume`。
 * 生产者在首次生产时连接，消费者在 `consume` 时连接，只发消息的进程不会加入消费组。
 * 处理成功后提交下一条偏移量（至少一次）。处理函数抛错则不提交，并结束本次消费。
 * 消费在 JSON 解析后按主题上的规则校验，失败同样不提交。
 * WebApp / ConsoleApp 关停时调用 `onDestroy` 断开连接。
 *
 * 消息体必须是 JSON。Date、bigint、Buffer 等无法原样还原的规则会在类型上被拒绝。
 * 需要别的编码时，传入 `encode` / `decode`。
 *
 * ```ts
 * // src/topics/order-created.topic.ts
 * export const orderCreatedTopic = defineKafkaTopic('order.created', {
 *   orderId: rule.string(),
 *   amount: rule.number(),
 * });
 *
 * // src/consumers/order-created.consumer.ts
 * import { orderCreatedTopic } from '../topics/order-created.topic.js';
 * export const consumer = new KafkaConsumer({ groupId: 'billing' });
 * consumer.on(orderCreatedTopic, {
 *   action: async (ctx) => {
 *     ctx.value.orderId;
 *     ctx.logger.info(ctx.recordKey);
 *   },
 * });
 *
 * // src/services/kafka.service.ts
 * export const KafkaService = createKafkaService({
 *   brokers: ['127.0.0.1:9092'],
 *   clientId: 'shop',
 *   logger,
 * });
 *
 * // src/routers/order.router.ts
 * await services.kafka.produce({
 *   topic: orderCreatedTopic,
 *   value: { orderId: '1', amount: 20 },
 * });
 * await services.kafka.consume('./src/consumers');
 * ```
 */
export function createKafkaService<T extends KafkaMiddlewareToken[] | [] = []>(
  options: Kafka.Options<T>,
): new () => Service & Kafka.Service {
  const settings = resolveOptions(options);
  return class KafkaService extends KafkaRuntime {
    public constructor() {
      super(settings);
    }
  };
}

class KafkaRuntime extends Service {
  private readonly settings: Resolved;
  private client?: KafkaJS.Kafka;
  private producer?: KafkaJS.Producer;
  private producerReady?: Promise<KafkaJS.Producer>;
  private consumer?: KafkaConsumerClient;
  private releaseTask?: Promise<void>;
  private consumption?: Consumption;
  private unbind: Array<() => void> = [];
  private consuming = false;
  private stopRequested = false;
  /** 消费已失败：拦住并发 eachMessage 继续处理或提交。 */
  private consumeAborted = false;
  private closed = false;

  protected constructor(settings: Resolved) {
    super();
    this.settings = settings;
  }

  /**
   * 生产一条消息。返回 broker 回执；`acks` 为 `0` 时数组为空。
   */
  public async produce<T>(
    message: {
      topic: KafkaTopic<T>;
      value: NoInfer<T>;
    } & Kafka.SendOptions,
  ): Promise<readonly Kafka.Receipt[]> {
    this.assertOpen();
    const wire = this.toMessage(message.value, message);
    const producer = await this.ensureProducer();
    const metadata = await producer.send({
      topic: message.topic.name,
      messages: [wire],
    });
    return this.toReceipts(metadata);
  }

  /**
   * 一次生产多条消息，按主题分组提交。空数组直接返回。
   * 回执顺序与 broker 响应一致，不保证与入参下标对齐。
   * 单条形状与 `produce` 相同。
   */
  public async produceMany<const T extends readonly unknown[]>(messages: {
    [I in keyof T]: {
      topic: KafkaTopic<T[I]>;
      value: NoInfer<T[I]>;
    } & Kafka.SendOptions;
  }): Promise<readonly Kafka.Receipt[]> {
    this.assertOpen();
    if (messages.length === 0) return [];

    const grouped = new Map<string, WireMessage[]>();
    for (const item of messages) {
      const wire = this.toMessage(item.value, item);
      const list = grouped.get(item.topic.name);
      if (list) list.push(wire);
      else grouped.set(item.topic.name, [wire]);
    }

    const producer = await this.ensureProducer();
    const metadata = await producer.sendBatch({
      topicMessages: [...grouped.entries()].map(([topic, batch]) => ({
        topic,
        messages: batch,
      })),
    });
    return this.toReceipts(metadata);
  }

  /**
   * 加入消费组并持续处理消息，直到进程关停或处理失败。
   *
   * 在 Console 指令里调用。不要放进 HTTP 请求：Promise 在关停前不会完成。
   * 处理函数成功返回后才提交下一条偏移量。抛错则不提交，Promise 拒绝，进程应按失败退出。
   * 同一实例不能并行消费；两个消费组请再 `createKafkaService` 一次。
   */
  public async consume(
    source: Kafka.ConsumeSource,
    options?: Kafka.ConsumeOptions,
  ): Promise<void> {
    this.assertOpen();
    if (this.consuming) {
      throw new Error(i18n.t('already_consuming'));
    }
    this.consuming = true;
    this.stopRequested = false;
    this.consumeAborted = false;
    let input: Subscription;
    let consumer: KafkaConsumerClient;
    const heartbeatInterval = this.settings.heartbeatInterval;
    try {
      input = this.subscriptions(await this.loadConsumers(source));
      if (Object.keys(input.each).length === 0) {
        this.consuming = false;
        return;
      }
      consumer = this.createClient().consumer({
        kafkaJS: {
          groupId: input.groupId,
          allowAutoTopicCreation: this.settings.allowAutoTopicCreation,
          sessionTimeout: this.settings.sessionTimeout,
          ...(heartbeatInterval > 0 ? { heartbeatInterval } : {}),
          fromBeginning: options?.fromBeginning ?? false,
          autoCommit: false,
          ...this.consumerFetch(),
        },
      });
    } catch (error) {
      this.consuming = false;
      throw error;
    }
    this.consumer = consumer;
    this.bindConsumer(consumer);
    const done = this.beginConsumption();

    try {
      await consumer.connect();
      await consumer.subscribe({ topics: Object.keys(input.each) });
      await consumer.run({
        eachMessage: async (payload) => {
          // 客户端在 eachMessage 抛错后仍可能继续调度；门闩拦住后续处理。
          if (this.consumeAborted) return;
          try {
            await this.handleMessage(payload, input.each, consumer, input.groupId);
          } catch (error) {
            this.abortConsumption(error);
            throw error;
          }
        },
      });
      await done;
    } finally {
      await this.releaseConsumer();
      this.clearBindings();
      this.finishConsumption();
      this.consumption = undefined;
      this.consuming = false;
    }
  }

  /** 创建客户端。网络连接推迟到发送或消费。 */
  protected override async onInit(): Promise<void> {
    this.createClient();
  }

  /** 停止消费者并断开生产者。重复调用无效果。 */
  protected override async onDestroy(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    await this.releaseConsumer();
    await this.releaseProducer();
  }

  private createClient(): KafkaJS.Kafka {
    if (this.client) return this.client;
    this.assertOpen();
    const { clientId, brokers, ssl, sasl, connectionTimeout, requestTimeout } =
      this.settings;
    const config: KafkaJS.CommonConstructorConfig = {
      'message.max.bytes': this.wireMessageMaxBytes(),
      'kafkaJS': {
        clientId,
        brokers: [...brokers],
        logLevel: KafkaJS.logLevel.WARN,
        logger: this.toClientLogger(),
        ...(ssl === undefined ? {} : { ssl: ssl !== false }),
        ...(sasl === undefined ? {} : { sasl: this.toSasl(sasl) }),
        ...(connectionTimeout === undefined ? {} : { connectionTimeout }),
        ...(requestTimeout === undefined ? {} : { requestTimeout }),
      },
    };
    this.applyTls(config);
    this.client = new KafkaJS.Kafka(config);
    return this.client;
  }

  /**
   * 把应用 `logger` 适配成客户端 logger。
   * 默认 `WARN`；只转发文案，不带 `extra`（可能含连接细节）。
   */
  private toClientLogger(): KafkaJS.Logger {
    const app = this.settings.logger;
    let current = KafkaJS.logLevel.WARN;
    const logger: KafkaJS.Logger = {
      setLogLevel: (next) => {
        current = next;
      },
      namespace: () => logger,
      info: (message) => {
        if (current >= KafkaJS.logLevel.INFO) app.info(message);
      },
      warn: (message) => {
        if (current >= KafkaJS.logLevel.WARN) app.warn(message);
      },
      error: (message) => {
        if (current >= KafkaJS.logLevel.ERROR) app.error(message);
      },
      debug: (message) => {
        if (current >= KafkaJS.logLevel.DEBUG) app.debug(message);
      },
    };
    return logger;
  }

  /** 把 TLS 对象映射成客户端认识的证书项。布尔值只表示开关。 */
  private applyTls(config: KafkaJS.CommonConstructorConfig): void {
    const ssl = this.settings.ssl;
    if (ssl == null || typeof ssl !== 'object') return;
    if (ssl.rejectUnauthorized === false) {
      config['enable.ssl.certificate.verification'] = false;
    }
    const ca = this.pem(ssl.ca, 'ca');
    if (ca !== undefined) config['ssl.ca.pem'] = ca;
    const cert = this.pem(ssl.cert, 'cert');
    if (cert !== undefined) config['ssl.certificate.pem'] = cert;
    const key = this.pem(ssl.key, 'key');
    if (key !== undefined) config['ssl.key.pem'] = key;
    if (typeof ssl.passphrase === 'string') config['ssl.key.password'] = ssl.passphrase;
  }

  private pem(value: unknown, name: string): string | undefined {
    if (value == null) return undefined;
    if (typeof value === 'string') return value;
    if (Buffer.isBuffer(value)) return value.toString('utf8');
    if (Array.isArray(value)) {
      return value.map((item) => this.pem(item, name) ?? '').join('\n');
    }
    throw new Error(i18n.t('unsupported_tls', { name }));
  }

  private toSasl(sasl: Kafka.Sasl): KafkaJS.SASLOptions {
    if (sasl.mechanism === 'aws') {
      throw new Error(i18n.t('unsupported_sasl', { mechanism: 'aws' }));
    }
    if (sasl.mechanism === 'oauthbearer') {
      const provide = sasl.oauthBearerProvider;
      return {
        mechanism: 'oauthbearer',
        oauthBearerProvider: async () => {
          const token = await provide();
          return {
            value: token.value,
            principal: '',
            lifetime: Date.now() + 3_600_000,
          };
        },
      };
    }
    return sasl;
  }

  private assertOpen(): void {
    if (this.closed) {
      throw new Error(i18n.t('closed'));
    }
  }

  private async ensureProducer(): Promise<KafkaJS.Producer> {
    this.assertOpen();
    this.producerReady ??= this.connectProducer().catch((error) => {
      this.producerReady = undefined;
      throw error;
    });
    return this.producerReady;
  }

  /**
   * 幂等开启时补上客户端兼容层不会自动改写的参数：在途请求 5、重试 `(2 ** 31) - 1`、先进先出。
   * 每次生产都等待回执，不等待攒批。
   */
  private producerConfig(): KafkaJS.ProducerConstructorConfig {
    const kafkaJS: KafkaJS.ProducerConfig = {
      idempotent: this.settings.idempotent,
      allowAutoTopicCreation: this.settings.allowAutoTopicCreation,
      acks: this.settings.acks,
    };
    const config: KafkaJS.ProducerConstructorConfig = {
      kafkaJS,
      'linger.ms': 0,
    };
    if (!this.settings.idempotent) return config;
    kafkaJS.maxInFlightRequests = 5;
    kafkaJS.retry = { retries: 2 ** 31 - 1 };
    config['queuing.strategy'] = 'fifo';
    return config;
  }

  /** 协议报文上限。客户端只接受 1000 到 1000000000。 */
  private wireMessageMaxBytes(): number {
    const bytes = this.settings.maxMessageBytes;
    if (bytes < 1_000) return 1_000;
    if (bytes > 1_000_000_000) return 1_000_000_000;
    return bytes;
  }

  /** 拉取上限只在允许的报文更大时上调。 */
  private consumerFetch(): { maxBytesPerPartition?: number; maxBytes?: number } {
    const bytes = this.wireMessageMaxBytes();
    return {
      ...(bytes > 1_048_576 ? { maxBytesPerPartition: bytes } : {}),
      ...(bytes > 10_485_760 ? { maxBytes: bytes } : {}),
    };
  }

  private async connectProducer(): Promise<KafkaJS.Producer> {
    const producer = this.createClient().producer(this.producerConfig());
    this.producer = producer;
    try {
      await producer.connect();
    } catch (error) {
      this.producer = undefined;
      await producer.disconnect().catch(() => undefined);
      throw error;
    }
    if (this.closed) {
      throw new Error(i18n.t('closed'));
    }
    return producer;
  }

  private async releaseProducer(): Promise<void> {
    const producer = this.producer;
    this.producer = undefined;
    this.producerReady = undefined;
    if (!producer) return;
    await producer.disconnect();
  }

  private toMessage(value: unknown, options?: Kafka.SendOptions): WireMessage {
    const encoded = this.encodeValue(value);
    let size = encoded.byteLength;
    if (options?.partitionKey !== undefined) {
      size += Buffer.byteLength(options.partitionKey);
    }
    if (options?.headers) {
      for (const [name, header] of Object.entries(options.headers)) {
        size += Buffer.byteLength(name) + Buffer.byteLength(header);
      }
    }
    this.assertSize(size);
    return {
      value: encoded,
      // 客户端消息字段仍叫 key
      ...(options?.partitionKey === undefined ? {} : { key: options.partitionKey }),
      ...(options?.headers === undefined ? {} : { headers: options.headers }),
      // 客户端消息字段仍叫 partition
      ...(options?.partitionId === undefined ? {} : { partition: options.partitionId }),
    };
  }

  /** 默认 JSON。`encode` 的返回值仍受 `maxMessageBytes` 约束。 */
  private encodeValue(value: unknown): Buffer {
    const encode = this.settings.encode;
    if (encode) return encode(value);
    let json: string | undefined;
    try {
      json = JSON.stringify(value) as string | undefined;
    } catch (error) {
      throw new Error(i18n.t('encode_failed'), { cause: error });
    }
    if (typeof json !== 'string') {
      throw new Error(i18n.t('encode_failed'));
    }
    return Buffer.from(json);
  }

  /** 默认 JSON。解析失败抛出固定文案。 */
  private decodeValue(buffer: Buffer): unknown {
    const decode = this.settings.decode;
    if (decode) return decode(buffer);
    try {
      return JSON.parse(buffer.toString('utf8')) as unknown;
    } catch (error) {
      throw new Error(i18n.t('invalid_json'), { cause: error });
    }
  }

  private assertSize(bytes: number): void {
    if (bytes > this.settings.maxMessageBytes) {
      throw new Error(
        i18n.t('message_too_large', {
          bytes: String(bytes),
          max: String(this.settings.maxMessageBytes),
        }),
      );
    }
  }

  private toReceipts(metadata: RecordMetadata[]): Kafka.Receipt[] {
    return metadata.map((item) => ({
      topic: item.topicName,
      partitionId: item.partition,
      offset: item.offset ?? item.baseOffset ?? null,
    }));
  }

  private beginConsumption(): Promise<void> {
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    this.consumption = { resolve, reject, settled: false };
    return promise;
  }

  private finishConsumption(): void {
    const current = this.consumption;
    if (!current || current.settled) return;
    current.settled = true;
    current.resolve();
  }

  private failConsumption(error: unknown): void {
    const current = this.consumption;
    if (!current || current.settled) return;
    current.settled = true;
    current.reject(error);
  }

  /** 标记消费失败、拒绝 `consume` Promise，并尽快断开，避免客户端继续拉取。 */
  private abortConsumption(error: unknown): void {
    this.consumeAborted = true;
    this.failConsumption(error);
    void this.releaseConsumer();
  }

  private bindConsumer(consumer: KafkaConsumerClient): void {
    const events = consumer.events;
    if (events == null || typeof consumer.on !== 'function') return;
    const listen = consumer.on.bind(consumer);
    this.unbind.push(
      listen(events.CRASH, (event) => {
        if (event.payload.restart) return;
        this.abortConsumption(event.payload.error);
      }),
      listen(events.STOP, () => {
        if (!this.stopRequested) return;
        this.finishConsumption();
      }),
    );
  }

  private clearBindings(): void {
    for (const off of this.unbind) off();
    this.unbind = [];
  }

  private releaseConsumer(): Promise<void> {
    if (this.releaseTask) return this.releaseTask;
    const consumer = this.consumer;
    const ending = this.consumption;
    this.consumer = undefined;
    this.stopRequested = true;
    this.releaseTask = (consumer ? consumer.disconnect() : Promise.resolve()).finally(
      () => {
        // 客户端的 run() 立刻返回，且没有 STOP 事件。断开后结束「发起本次释放」时的那轮 consume。
        if (ending && !ending.settled) {
          ending.settled = true;
          ending.resolve();
        }
        this.releaseTask = undefined;
      },
    );
    return this.releaseTask;
  }

  private async loadConsumers(source: Kafka.ConsumeSource): Promise<KafkaConsumer[]> {
    if (source instanceof KafkaConsumer) return [source];
    if (this.isConsumerList(source)) return [...source];
    const files = await pathToFiles(source);
    return getFileValues(files, (item) => item instanceof KafkaConsumer);
  }

  private isConsumerList(
    source: Kafka.ConsumeSource,
  ): source is readonly KafkaConsumer[] {
    return (
      Array.isArray(source) && (source.length === 0 || source[0] instanceof KafkaConsumer)
    );
  }

  private subscriptions(consumers: readonly KafkaConsumer[]): Subscription {
    if (consumers.length === 0) {
      throw new Error(i18n.t('empty_consumers'));
    }
    const each: Record<string, BoundHandler> = {};
    let groupId: string | undefined;
    for (const consumer of consumers) {
      const handlers = consumer['collect']();
      if (handlers.length === 0) continue;
      if (groupId === undefined) groupId = consumer.groupId;
      else if (consumer.groupId !== groupId) {
        throw new Error(i18n.t('mixed_group_id'));
      }
      for (const handler of handlers) {
        const name = handler.topic.name;
        if (Object.hasOwn(each, name)) {
          throw new Error(i18n.t('duplicate_topic', { topic: name }));
        }
        each[name] = {
          rule: handler.topic.rule,
          route: compose([
            ...this.settings.mount,
            ...handler.middlewareList,
            middleware.kafka((ctx, _) => handler.action(ctx)),
          ]),
        };
      }
    }
    return { groupId: groupId ?? '', each };
  }

  private async handleMessage(
    payload: KafkaJS.EachMessagePayload,
    each: Readonly<Record<string, BoundHandler>>,
    consumer: KafkaConsumerClient,
    groupId: string,
  ): Promise<void> {
    const { topic, partition, message, heartbeat } = payload;
    const handler = each[topic];
    if (!handler) {
      throw new Error(i18n.t('unknown_topic', { topic }));
    }
    if (message.value == null) {
      throw new Error(i18n.t('empty_message'));
    }

    const headers = 'headers' in message ? message.headers : undefined;
    this.assertIncomingSize(message.value, message.key, headers);
    const value = await validate(this.decodeValue(message.value), handler.rule);
    const ctx: Kafka.Context = {
      value,
      logger: this.settings.logger,
      recordKey: this.recordKey(groupId, topic, partition, message.offset),
      meta: {
        topic,
        partitionId: partition,
        offset: message.offset,
        timestamp: message.timestamp,
        partitionKey: this.readPartitionKey(message.key),
        headers: this.readHeaders(headers),
      },
    };
    const pulse = this.startHeartbeat(heartbeat);
    try {
      await handler.route(ctx);
      const failure = pulse.failure();
      if (failure) throw failure;
      // 并发分区上另一条消息可能已触发失败；提交前再拦一次。
      if (this.consumeAborted) return;
      await consumer.commitOffsets([
        { topic, partition, offset: this.nextOffset(message.offset) },
      ]);
    } finally {
      pulse.stop();
    }
  }

  private assertIncomingSize(
    value: Buffer,
    key: Buffer | null,
    headers: KafkaJS.IHeaders | undefined,
  ): void {
    let size = value.byteLength;
    if (key) size += key.byteLength;
    if (headers) {
      for (const [name, raw] of Object.entries(headers)) {
        size += Buffer.byteLength(name);
        const values = Array.isArray(raw) ? raw : raw == null ? [] : [raw];
        for (const item of values) {
          size += typeof item === 'string' ? Buffer.byteLength(item) : item.byteLength;
        }
      }
    }
    this.assertSize(size);
  }

  /** `groupId` 与主题按 URL 编码，避免其中的 `:` 打断分段。 */
  private recordKey(
    groupId: string,
    topic: string,
    partition: number,
    offset: string,
  ): string {
    return [
      encodeURIComponent(groupId),
      encodeURIComponent(topic),
      String(partition),
      encodeURIComponent(offset),
    ].join(':');
  }

  private readPartitionKey(key: Buffer | null): string | null {
    if (key == null) return null;
    return key.toString('utf8');
  }

  private readHeaders(headers: KafkaJS.IHeaders | undefined): Record<string, string> {
    if (!headers) return {};
    const result: Record<string, string> = {};
    for (const [key, raw] of Object.entries(headers)) {
      if (raw == null) continue;
      const picked = Array.isArray(raw) ? raw[raw.length - 1] : raw;
      if (picked == null) continue;
      result[key] = typeof picked === 'string' ? picked : picked.toString('utf8');
    }
    return result;
  }

  private nextOffset(offset: string): string {
    if (!/^\d+$/.test(offset)) {
      throw new Error(i18n.t('invalid_offset', { offset }));
    }
    return (BigInt(offset) + 1n).toString();
  }

  private startHeartbeat(heartbeat: () => Promise<void>): {
    stop: () => void;
    failure: () => unknown;
  } {
    if (!(this.settings.heartbeatInterval > 0)) {
      return { stop() {}, failure: () => undefined };
    }
    let failure: unknown;
    const timer = setInterval(() => {
      void heartbeat().catch((error) => {
        failure ??= error;
      });
    }, this.settings.heartbeatInterval);
    return {
      stop: () => clearInterval(timer),
      failure: () => failure,
    };
  }
}

export namespace Kafka {
  /** `createKafkaService` 返回的实例。配置与连接不在这个表面上。 */
  export interface Service {
    produce<T>(
      message: {
        topic: KafkaTopic<T>;
        value: NoInfer<T>;
      } & SendOptions,
    ): Promise<readonly Receipt[]>;

    produceMany<const T extends readonly unknown[]>(messages: {
      [I in keyof T]: {
        topic: KafkaTopic<T[I]>;
        value: NoInfer<T[I]>;
      } & SendOptions;
    }): Promise<readonly Receipt[]>;

    consume(source: ConsumeSource, options?: ConsumeOptions): Promise<void>;
  }

  export type ConsumeSource = KafkaConsumer | readonly KafkaConsumer[] | GlobPathOptions;

  export interface ConsumeOptions {
    /**
     * 为 `true` 时，在没有已提交位点时从最早偏移量读；默认 `false`（从最新）。
     * 已有提交位点时仍从提交处继续，不受本选项影响。
     */
    fromBeginning?: boolean;
  }

  export type Ssl = boolean | ConnectionOptions;

  export type Sasl =
    | { mechanism: 'plain'; username: string; password: string }
    | { mechanism: 'scram-sha-256'; username: string; password: string }
    | { mechanism: 'scram-sha-512'; username: string; password: string }
    | {
        mechanism: 'aws';
        authorizationIdentity: string;
        accessKeyId: string;
        secretAccessKey: string;
        sessionToken?: string;
      }
    | {
        mechanism: 'oauthbearer';
        oauthBearerProvider: () => Promise<{ value: string }>;
      };

  /**
   * 模块扩充点，可挂服务级推断类型：
   *
   * ```ts
   * declare module '@aomex/kafka' {
   *   namespace Kafka {
   *     interface Props {
   *       traceId: string;
   *     }
   *   }
   * }
   * ```
   */
  export interface Props {}

  export interface Options<T extends KafkaMiddlewareToken[] | [] = []> {
    /** broker 地址，如 `127.0.0.1:9092`。 */
    brokers: readonly string[];

    /**
     * 应用日志。消费 `ctx.logger` 与此实例相同。
     * 客户端内部日志（默认 `WARN`）也会经适配器写入本实例，不转发 `extra`。
     */
    logger: Logger;

    /**
     * 本服务下所有消费共用的中间件（先于消费组 / 主题级 `mount` 执行）。
     * 仅 `middleware.kafka` / `middleware.mixin`。
     */
    mount?: T;

    /**
     * 客户端标识，任意非空字符串均可。会出现在 broker 日志与监控里，用于区分应用。
     */
    clientId: string;

    /**
     * 传给连接层的 TLS 配置。不设则沿用客户端默认。
     * 对象里的证书和私钥只接受 PEM 字符串、Buffer，或由它们组成的数组。
     */
    ssl?: Ssl;

    /**
     * SASL 认证。不设则不认证。
     * `aws` 当前客户端不支持，传入会在连接前抛错。
     * `oauthbearer` 只需返回 `value`。
     */
    sasl?: Sasl;

    /**
     * 连接超时。毫秒数或可读时长，如 `1_000`、`'1s'`。不设则沿用客户端默认。
     */
    connectionTimeout?: DurationInput;

    /**
     * 请求超时。毫秒数或可读时长，如 `30_000`、`'30s'`。不设则沿用客户端默认。
     */
    requestTimeout?: DurationInput;

    /** 是否允许 broker 自动建主题。默认 `false`。 */
    allowAutoTopicCreation?: boolean;

    /**
     * 幂等生产者。默认 `true`，此时 `acks` 必须为 `-1`。
     * 开启后在途请求为 5，重试次数为 `(2 ** 31) - 1`，队列为先进先出。
     */
    idempotent?: boolean;

    /**
     * 生产者确认级别。`-1` 全部副本，`1` 仅 leader，`0` 不等待。默认 `-1`。
     */
    acks?: -1 | 0 | 1;

    /**
     * 单条消息（值、分区键、header）的字节上限。默认 1 MiB。
     * 超过则拒绝发送，消费侧也拒绝解析。
     * 传给客户端的协议上限与此相同，并限制在 1000 到 1000000000。
     * 消费拉取上限只在这个值更大时上调。
     */
    maxMessageBytes?: number;

    /**
     * 消费组会话超时。毫秒数或可读时长，如 `30_000`、`'30s'`。默认 `'30s'`。
     */
    sessionTimeout?: DurationInput;

    /**
     * 处理消息期间自动心跳的间隔。毫秒数或可读时长，如 `3_000`、`'3s'`。
     * 未设置时取 `min(3s, sessionTimeout / 3)`。
     * 大于等于会话超时时拒绝创建。
     * 小于等于 `0` 时本库不再按间隔调用心跳回调。客户端自己的会话心跳仍会继续。
     */
    heartbeatInterval?: DurationInput;

    /** 把消息体编码成字节。默认 JSON。 */
    encode?: (value: unknown) => Buffer;

    /** 把消息字节解成消息体。默认 JSON。 */
    decode?: (buffer: Buffer) => unknown;
  }

  export interface SendOptions {
    /**
     * 分区键。相同值进入同一分区，从而保证同键消息有序。
     * 不传则由客户端分区器分配。
     */
    partitionKey?: string;
    /**
     * 消息头：跟消息体分开的元数据，消费端在 `ctx.meta.headers` 读取。
     * 典型用途：链路追踪（`traceId`）、报文版本、中间件按头过滤，而不必塞进业务 JSON。
     * 键值均为字符串，会计入 `maxMessageBytes`；同一键多个值时消费侧只保留最后一个。
     */
    headers?: Record<string, string>;
    /** 指定分区编号。与 `partitionKey` 同时传时，以本字段为准。 */
    partitionId?: number;
  }

  /** broker 对一条消息的回执。 */
  export interface Receipt {
    /** 写入的主题名。 */
    topic: string;
    /** 写入的分区编号。 */
    partitionId: number;
    /** 写入后的偏移量；`acks` 为 `0` 或 broker 未返回时为 `null`。 */
    offset: string | null;
  }

  /**
   * 消费到的消息位置与元数据，会出现在处理函数的 `ctx.meta` 上。
   */
  export interface Meta {
    /** 主题名，与 `defineKafkaTopic` 登记的名字一致。 */
    topic: string;
    /** 实际落入的分区编号。 */
    partitionId: number;
    /** 本分区内的消息偏移量（字符串，避免超过 JS 安全整数）。 */
    offset: string;
    /** broker 侧消息时间戳（毫秒字符串）。 */
    timestamp: string;
    /**
     * 生产时的分区键；未设置则为 `null`。
     * 同键消息进同一分区，从而有序；不是业务单号。
     */
    partitionKey: string | null;
    /**
     * 生产时附带的消息头；键值均为字符串。
     * 同一键有多个值时只保留最后一个；没有头时为空对象。
     */
    headers: Record<string, string>;
  }

  /**
   * 消费处理函数与 `middleware.kafka` 的上下文。
   * `value` 为消息体，`recordKey` 为本条记录稳定标识，`meta` 为 broker 位置与消息元数据，
   * `logger` 与 `createKafkaService` 传入的相同。`mount` 注入的属性也会出现在 `ctx` 上。
   */
  export type Context<T = unknown> = {
    /** 经主题规则校验后的消息体。 */
    value: T;
    /** 与 `createKafkaService` 传入的相同；中间件与处理函数共用。 */
    logger: Logger;
    /**
     * 本消费组视角下这条记录的稳定标识：`groupId:主题:分区:偏移量`，
     * 如 `billing:order.created:0:9`。用于日志关联或去重键，不是分区键，也不是业务单号。
     */
    recordKey: string;
    /** broker 侧位置与消息元数据（主题、分区、偏移量、头等）。 */
    meta: Meta;
  } & Props;

  export type Handler<T> = (ctx: Context<T>) => void | Promise<void>;
}
