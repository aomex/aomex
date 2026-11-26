import {
  combineServices,
  ensureI18nLanguage,
  internalDestroyServices,
  middleware,
  rule,
} from '@aomex/common';
import { Logger } from '@aomex/logger';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, test, vi, type Mock } from 'vitest';
import {
  createKafkaService,
  defineKafkaTopic,
  KafkaConsumer,
  KafkaMiddleware,
  type Kafka,
  type KafkaTopic,
} from '../src';
import { i18n } from '../src/i18n';

const testLogger = new Logger({ transports: [] });

type WireMessage = {
  value: Buffer;
  key?: string;
  headers?: Record<string, string>;
  partition?: number;
};

type Listener = (event: {
  id: string;
  type: string;
  timestamp: number;
  payload: unknown;
}) => void;

type AsyncMock = Mock<() => Promise<void>>;

type SendRecord = {
  topic: string;
  messages: WireMessage[];
};

type RunConfig = {
  eachMessage: (payload: {
    topic: string;
    partition: number;
    message: {
      key: Buffer | null;
      value: Buffer | null;
      timestamp: string;
      attributes: number;
      offset: string;
      headers?: Record<string, unknown>;
    };
    heartbeat: () => Promise<void>;
    pause: () => () => void;
  }) => Promise<void>;
};

type MockProducer = {
  config: {
    'kafkaJS': {
      idempotent?: boolean;
      allowAutoTopicCreation?: boolean;
      acks?: number;
      maxInFlightRequests?: number;
      retry?: { retries?: number };
    };
    'queuing.strategy'?: string;
    'linger.ms'?: number;
  };
  connect: AsyncMock;
  disconnect: AsyncMock;
  send: Mock<(record: SendRecord) => Promise<Array<Record<string, unknown>>>>;
  sendBatch: Mock<
    (batch: {
      topicMessages: Array<{ topic: string; messages: WireMessage[] }>;
    }) => Promise<Array<Record<string, unknown>>>
  >;
};

type ConsumerKafkaJs = {
  groupId: string;
  allowAutoTopicCreation?: boolean;
  sessionTimeout?: number;
  heartbeatInterval?: number;
  fromBeginning?: boolean;
  autoCommit?: boolean;
  maxBytesPerPartition?: number;
  maxBytes?: number;
};

type MockConsumer = {
  config: { kafkaJS: ConsumerKafkaJs };
  connect: AsyncMock;
  disconnect: AsyncMock;
  subscribe: Mock<(subscription: { topics: string[] }) => Promise<void>>;
  commitOffsets: Mock<(offsets: Array<Record<string, unknown>>) => Promise<void>>;
  stop: AsyncMock;
  run: Mock<(config: RunConfig) => Promise<void>>;
  on?: Mock<(event: string, listener: Listener) => () => void>;
  events?: { CRASH: 'consumer.crash'; STOP: 'consumer.stop' };
  deliver: (message: {
    topic: string;
    value: Buffer | null;
    partition?: number;
    offset?: string;
    timestamp?: string;
    key?: Buffer | null;
    headers?: Record<string, unknown>;
    heartbeat?: () => Promise<void>;
  }) => Promise<void>;
  emitCrash: (error: Error, restart: boolean) => void;
};

type MockClient = {
  config: Record<string, unknown>;
  producers: MockProducer[];
  consumers: MockConsumer[];
};

const state = vi.hoisted(() => {
  return {
    clients: [] as MockClient[],
    producerConnectError: undefined as Error | undefined,
    producerDisconnectError: undefined as Error | undefined,
    consumerConnectError: undefined as Error | undefined,
    sendResults: [] as Array<Array<Record<string, unknown>>>,
    holdProducerConnect: undefined as Promise<void> | undefined,
    onProducerConnect: undefined as (() => void) | undefined,
    omitConsumerEvents: false,
    omitConsumerOn: false,
  };
});

vi.mock('@confluentinc/kafka-javascript', () => {
  class KafkaClient {
    constructor(config: Record<string, unknown>) {
      const client: MockClient = { config, producers: [], consumers: [] };
      state.clients.push(client);
      this.client = client;
    }

    private readonly client: MockClient;

    producer(config: MockProducer['config']): MockProducer {
      const producer: MockProducer = {
        config,
        connect: vi.fn(async () => {
          state.onProducerConnect?.();
          if (state.holdProducerConnect) await state.holdProducerConnect;
          if (state.producerConnectError) throw state.producerConnectError;
        }),
        disconnect: vi.fn(async () => {
          if (state.producerDisconnectError) throw state.producerDisconnectError;
        }),
        send: vi.fn(async ({ topic }: { topic: string }) => {
          const custom = state.sendResults.shift();
          if (custom) return custom;
          return [
            {
              topicName: topic,
              partition: 1,
              errorCode: 0,
              offset: '9',
              timestamp: '1',
            },
          ];
        }),
        sendBatch: vi.fn(
          async ({
            topicMessages,
          }: {
            topicMessages: Array<{ topic: string; messages: unknown[] }>;
          }) =>
            topicMessages.flatMap((item) =>
              item.messages.map((_, index) => ({
                topicName: item.topic,
                partition: 0,
                errorCode: 0,
                offset: String(index),
              })),
            ),
        ),
      };
      this.client.producers.push(producer);
      return producer;
    }

    consumer(config: MockConsumer['config']): MockConsumer {
      const listeners = new Map<string, Set<Listener>>();
      const emit = (event: string, payload?: unknown) => {
        const body = { id: '1', type: event, timestamp: Date.now(), payload };
        for (const listener of listeners.get(event) ?? []) listener(body);
      };
      const consumer = {
        config,
        connect: vi.fn(async () => {
          if (state.consumerConnectError) throw state.consumerConnectError;
        }),
        stop: vi.fn(async () => {
          emit('consumer.stop');
        }),
        disconnect: vi.fn(async () => {
          await consumer.stop();
        }),
        subscribe: vi.fn(async () => {}),
        commitOffsets: vi.fn(async () => {}),
        run: vi.fn(async (_config: RunConfig) => {}),
        ...(state.omitConsumerEvents
          ? {}
          : {
              events: { CRASH: 'consumer.crash', STOP: 'consumer.stop' } as const,
              ...(state.omitConsumerOn
                ? {}
                : {
                    on: vi.fn((event: string, listener: Listener) => {
                      const set = listeners.get(event) ?? new Set<Listener>();
                      set.add(listener);
                      listeners.set(event, set);
                      return () => set.delete(listener);
                    }),
                  }),
            }),
        deliver: async (message: {
          topic: string;
          value: Buffer | null;
          partition?: number;
          offset?: string;
          timestamp?: string;
          key?: Buffer | null;
          headers?: Record<string, unknown>;
          heartbeat?: () => Promise<void>;
        }) => {
          const config = consumer.run.mock.calls[0]?.[0];
          if (!config) throw new Error('consumer.run 尚未调用');
          await config.eachMessage({
            topic: message.topic,
            partition: message.partition ?? 0,
            message: {
              key: message.key ?? null,
              value: message.value,
              timestamp: message.timestamp ?? '0',
              attributes: 0,
              offset: message.offset ?? '0',
              ...(message.headers === undefined ? {} : { headers: message.headers }),
            },
            heartbeat: message.heartbeat ?? (async () => {}),
            pause: () => () => {},
          });
        },
        emitCrash: (error: Error, restart: boolean) => {
          emit('consumer.crash', {
            error,
            groupId: config.kafkaJS.groupId,
            restart,
          });
        },
      } satisfies MockConsumer;
      this.client.consumers.push(consumer);
      return consumer;
    }
  }

  return {
    KafkaJS: {
      Kafka: KafkaClient,
      logLevel: { NOTHING: 0, ERROR: 1, WARN: 2, INFO: 3, DEBUG: 4 },
    },
  };
});

const orderCreatedTopic = defineKafkaTopic(
  'order.created',
  rule.object({
    orderId: rule.string(),
    amount: rule.number(),
  }),
);

const userRegisteredTopic = defineKafkaTopic(
  'user.registered',
  rule.object({
    userId: rule.string(),
  }),
);

const pingTopic = defineKafkaTopic(
  'ping',
  rule.object({
    ok: rule.boolean(),
  }),
);

function group<T>(
  groupId: string,
  topic: KafkaTopic<T>,
  action: (ctx: Kafka.Context<T>) => void | Promise<void> = () => {},
): KafkaConsumer {
  const consumer = new KafkaConsumer({ groupId });
  consumer.on(topic, { action });
  return consumer;
}

const ShopKafka = createKafkaService({
  logger: testLogger,
  brokers: ['127.0.0.1:9092', '127.0.0.2:9092'],
  clientId: 'shop',
});

const BareKafka = createKafkaService({
  clientId: 'test',

  logger: testLogger,
  brokers: ['broker:9092'],
});

const SecureKafka = createKafkaService({
  clientId: 'test',

  logger: testLogger,
  brokers: ['broker:9092'],
  ssl: false,
  sasl: { mechanism: 'plain', username: 'user', password: 'secret' },
  connectionTimeout: '1s',
  requestTimeout: 2_000,
  allowAutoTopicCreation: true,
  idempotent: false,
  acks: 0,
  sessionTimeout: '10s',
  heartbeatInterval: '1s',
});

const TinyKafka = createKafkaService({
  clientId: 'test',

  logger: testLogger,
  brokers: ['broker:9092'],
  maxMessageBytes: 4,
});

const QuietHeartbeatKafka = createKafkaService({
  logger: testLogger,
  brokers: ['127.0.0.1:9092', '127.0.0.2:9092'],
  clientId: 'shop',
  heartbeatInterval: '0ms',
});

const PrefixedKafka = createKafkaService({
  logger: testLogger,
  brokers: ['127.0.0.1:9092', '127.0.0.2:9092'],
  clientId: 'shop',
  encode: (value) =>
    Buffer.concat([Buffer.from('v1:'), Buffer.from(JSON.stringify(value))]),
  decode: (buffer) => JSON.parse(buffer.subarray(3).toString('utf8')) as unknown,
});

type OpenKafka = {
  onInit(): Promise<void>;
  onDestroy(): Promise<void>;
  failConsumption(error: unknown): void;
  finishConsumption(): void;
  releaseConsumer(): Promise<void>;
};

function open(service: object): OpenKafka {
  return service as OpenKafka;
}

const order = { orderId: '1', amount: 20 };

function client(): MockClient {
  const current = state.clients.at(-1);
  if (!current) throw new Error('尚未创建 Kafka 客户端');
  return current;
}

function producer(): MockProducer {
  const current = client().producers.at(-1);
  if (!current) throw new Error('尚未创建生产者');
  return current;
}

function consumer(): MockConsumer {
  const current = client().consumers.at(-1);
  if (!current) throw new Error('尚未创建消费者');
  return current;
}

async function started(): Promise<void> {
  await vi.waitUntil(() => {
    const current = state.clients.at(-1)?.consumers.at(-1);
    return (current?.run.mock.calls.length ?? 0) > 0;
  });
}

beforeEach(() => {
  state.clients.length = 0;
  state.producerConnectError = undefined;
  state.producerDisconnectError = undefined;
  state.consumerConnectError = undefined;
  state.sendResults = [];
  state.holdProducerConnect = undefined;
  state.onProducerConnect = undefined;
  state.omitConsumerEvents = false;
  state.omitConsumerOn = false;
});

afterEach(() => {
  vi.useRealTimers();
});

test('onInit 只创建客户端，发送时才连接生产者', async () => {
  const kafka = new ShopKafka();
  await open(kafka).onInit();
  expect(client().config).toMatchObject({
    'message.max.bytes': 1_048_576,
    'kafkaJS': {
      clientId: 'shop',
      brokers: ['127.0.0.1:9092', '127.0.0.2:9092'],
      logLevel: 2,
    },
  });
  expect(client().config['kafkaJS']).toHaveProperty('logger');
  expect(client().producers).toHaveLength(0);

  const receipts = await kafka.produce({ topic: orderCreatedTopic, value: order });
  expect(receipts).toEqual([{ topic: 'order.created', partitionId: 1, offset: '9' }]);
  expect(producer().config).toEqual({
    'linger.ms': 0,
    'queuing.strategy': 'fifo',
    'kafkaJS': {
      idempotent: true,
      allowAutoTopicCreation: false,
      acks: -1,
      maxInFlightRequests: 5,
      retry: { retries: 2 ** 31 - 1 },
    },
  });
  expect(producer().connect).toHaveBeenCalledTimes(1);
  expect(producer().send).toHaveBeenCalledWith({
    topic: 'order.created',
    messages: [{ value: Buffer.from(JSON.stringify(order)) }],
  });

  await kafka.produce({
    topic: orderCreatedTopic,
    value: order,
    partitionKey: 'k',
    headers: { trace: 'abc' },
    partitionId: 3,
  });
  expect(producer().connect).toHaveBeenCalledTimes(1);
  expect(producer().send).toHaveBeenLastCalledWith({
    topic: 'order.created',
    messages: [
      {
        value: Buffer.from(JSON.stringify(order)),
        key: 'k',
        headers: { trace: 'abc' },
        partition: 3,
      },
    ],
  });
});

test('clientId 原样传给客户端', async () => {
  const kafka = new BareKafka();
  await kafka.produce({ topic: pingTopic, value: { ok: true } });
  expect(client().config).toMatchObject({ kafkaJS: { clientId: 'test' } });
});

test('clientId 为空时在创建前失败', () => {
  expect(() =>
    createKafkaService({ clientId: '', logger: testLogger, brokers: ['broker:9092'] }),
  ).toThrow(i18n.t('empty_client_id'));
  expect(state.clients).toHaveLength(0);
});

test('TLS、SASL 与超时原样传给客户端', async () => {
  const kafka = new SecureKafka();
  await kafka.produce({ topic: pingTopic, value: { ok: true } });
  expect(client().config).toMatchObject({
    kafkaJS: {
      ssl: false,
      sasl: { mechanism: 'plain', username: 'user', password: 'secret' },
      connectionTimeout: 1_000,
      requestTimeout: 2_000,
      logLevel: 2,
    },
  });
  expect(producer().config).toEqual({
    'linger.ms': 0,
    'kafkaJS': {
      idempotent: false,
      allowAutoTopicCreation: true,
      acks: 0,
    },
  });
  expect(producer().send).toHaveBeenCalledWith(
    expect.not.objectContaining({ acks: expect.anything() }),
  );
});

test('回执缺少 offset 时回退 baseOffset，再没有则为 null', async () => {
  state.sendResults = [
    [{ topicName: 'order.created', partition: 2, errorCode: 0, baseOffset: '3' }],
    [{ topicName: 'order.created', partition: 2, errorCode: 0 }],
  ];
  const kafka = new ShopKafka();
  await expect(
    kafka.produce({ topic: orderCreatedTopic, value: order }),
  ).resolves.toEqual([{ topic: 'order.created', partitionId: 2, offset: '3' }]);
  await expect(
    kafka.produce({ topic: orderCreatedTopic, value: order }),
  ).resolves.toEqual([{ topic: 'order.created', partitionId: 2, offset: null }]);
});

test('produceMany 按主题分组并保留主题内顺序', async () => {
  const kafka = new ShopKafka();
  const receipts = await kafka.produceMany([
    { topic: orderCreatedTopic, value: order, partitionKey: 'a' },
    { topic: userRegisteredTopic, value: { userId: 'u' } },
    { topic: orderCreatedTopic, value: { orderId: '2', amount: 1 }, partitionId: 4 },
  ]);
  expect(producer().sendBatch).toHaveBeenCalledWith({
    topicMessages: [
      {
        topic: 'order.created',
        messages: [
          { value: Buffer.from(JSON.stringify(order)), key: 'a' },
          {
            value: Buffer.from(JSON.stringify({ orderId: '2', amount: 1 })),
            partition: 4,
          },
        ],
      },
      {
        topic: 'user.registered',
        messages: [{ value: Buffer.from(JSON.stringify({ userId: 'u' })) }],
      },
    ],
  });
  expect(receipts).toEqual([
    { topic: 'order.created', partitionId: 0, offset: '0' },
    { topic: 'order.created', partitionId: 0, offset: '1' },
    { topic: 'user.registered', partitionId: 0, offset: '0' },
  ]);
});

test('produceMany 空数组不建连', async () => {
  const kafka = new ShopKafka();
  await expect(kafka.produceMany([])).resolves.toEqual([]);
  expect(state.clients).toHaveLength(0);
});

test('空 partitionKey 仍写入消息', async () => {
  const kafka = new ShopKafka();
  await kafka.produce({ topic: orderCreatedTopic, value: order, partitionKey: '' });
  expect(producer().send).toHaveBeenCalledWith(
    expect.objectContaining({
      messages: [expect.objectContaining({ key: '' })],
    }),
  );
});

test('brokers 为空或含空地址时在创建客户端前失败', () => {
  expect(() =>
    createKafkaService({ clientId: 'test', logger: testLogger, brokers: [] }),
  ).toThrow(i18n.t('empty_brokers'));
  expect(() =>
    createKafkaService({ clientId: 'test', logger: testLogger, brokers: [''] }),
  ).toThrow(i18n.t('empty_broker'));
  expect(state.clients).toHaveLength(0);
});

test('幂等生产者不允许 acks 不是 -1', () => {
  expect(() =>
    createKafkaService({
      clientId: 'test',

      logger: testLogger,
      brokers: ['broker:9092'],
      acks: 1,
    }),
  ).toThrow(i18n.t('idempotent_requires_all_acks'));
  expect(state.clients).toHaveLength(0);
});

test('超过大小限制的消息不会发送', async () => {
  const kafka = new TinyKafka();
  await expect(kafka.produce({ topic: orderCreatedTopic, value: order })).rejects.toThrow(
    i18n.t('message_too_large', {
      bytes: String(JSON.stringify(order).length),
      max: '4',
    }),
  );
  expect(state.clients).toHaveLength(0);
});

test('partitionKey 与 header 计入发送大小', async () => {
  const payload = { orderId: '1', amount: 1 };
  const exact = Buffer.byteLength(JSON.stringify(payload));
  const kafka = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    maxMessageBytes: exact,
  }))();
  await expect(
    kafka.produce({ topic: orderCreatedTopic, value: payload }),
  ).resolves.toHaveLength(1);
  await expect(
    kafka.produce({ topic: orderCreatedTopic, value: payload, partitionKey: 'a' }),
  ).rejects.toThrow(
    i18n.t('message_too_large', { bytes: String(exact + 1), max: String(exact) }),
  );
  await expect(
    kafka.produce({ topic: orderCreatedTopic, value: payload, headers: { a: 'b' } }),
  ).rejects.toThrow(
    i18n.t('message_too_large', { bytes: String(exact + 2), max: String(exact) }),
  );
});

test('循环引用无法编码', async () => {
  const kafka = new ShopKafka();
  const value: { orderId: string; amount: number; self?: unknown } = {
    orderId: '1',
    amount: 1,
  };
  value.self = value;
  await expect(kafka.produce({ topic: orderCreatedTopic, value: value })).rejects.toThrow(
    i18n.t('encode_failed'),
  );
});

test('顶层 undefined 无法编码', async () => {
  const kafka = new ShopKafka();
  await expect(
    kafka.produce({ topic: orderCreatedTopic, value: undefined as never }),
  ).rejects.toThrow(i18n.t('encode_failed'));
  expect(state.clients).toHaveLength(0);
});

test('生产者连接失败后可以重试，断开失败不掩盖连接错误', async () => {
  const kafka = new ShopKafka();
  state.producerConnectError = new Error('down');
  state.producerDisconnectError = new Error('disc');
  await expect(kafka.produce({ topic: orderCreatedTopic, value: order })).rejects.toThrow(
    'down',
  );
  expect(producer().disconnect).toHaveBeenCalledTimes(1);

  state.producerConnectError = undefined;
  state.producerDisconnectError = undefined;
  await expect(
    kafka.produce({ topic: orderCreatedTopic, value: order }),
  ).resolves.toHaveLength(1);
  expect(client().producers).toHaveLength(2);
});

test('关停发生在生产者连接期间时发送失败', async () => {
  const release = Promise.withResolvers<void>();
  state.holdProducerConnect = release.promise;
  const connected = Promise.withResolvers<void>();
  state.onProducerConnect = () => connected.resolve();

  const kafka = new ShopKafka();
  const pending = kafka.produce({ topic: orderCreatedTopic, value: order });
  await connected.promise;
  const stopping = open(kafka).onDestroy();
  release.resolve();
  await expect(pending).rejects.toThrow(i18n.t('closed'));
  await stopping;
  await expect(kafka.produce({ topic: orderCreatedTopic, value: order })).rejects.toThrow(
    i18n.t('closed'),
  );
  await expect(kafka.produceMany([])).rejects.toThrow(i18n.t('closed'));
  await expect(kafka.consume(group('billing', orderCreatedTopic))).rejects.toThrow(
    i18n.t('closed'),
  );
});

test('没有进行中的消费时忽略结束信号', () => {
  const kafka = new ShopKafka();
  open(kafka).failConsumption(new Error('x'));
  open(kafka).finishConsumption();
});

test('重复的失败信号只拒绝一次', async () => {
  const kafka = new ShopKafka();
  const pending = kafka.consume(
    group('billing', orderCreatedTopic, () => {
      consumer().emitCrash(new Error('fatal'), false);
      throw new Error('boom');
    }),
  );
  const assertion = expect(pending).rejects.toThrow('fatal');
  await started();
  await expect(
    consumer().deliver({
      topic: 'order.created',
      value: Buffer.from(JSON.stringify(order)),
    }),
  ).rejects.toThrow('boom');
  await assertion;
});

test('关停断开生产者且重复关停无效果', async () => {
  const kafka = new ShopKafka();
  await kafka.produce({ topic: orderCreatedTopic, value: order });
  await open(kafka).onDestroy();
  await open(kafka).onDestroy();
  expect(producer().disconnect).toHaveBeenCalledTimes(1);
});

test('消费成功后提交下一条偏移量', async () => {
  const kafka = new ShopKafka();
  const seen: Array<{ orderId: string; recordKey: string; meta: Kafka.Meta }> = [];
  const pending = kafka.consume(
    group('billing', orderCreatedTopic, (ctx) => {
      expect(ctx.logger).toBe(testLogger);
      seen.push({
        orderId: ctx.value.orderId,
        recordKey: ctx.recordKey,
        meta: ctx.meta,
      });
    }),
  );
  await started();
  expect(consumer().config).toEqual({
    kafkaJS: {
      groupId: 'billing',
      allowAutoTopicCreation: false,
      sessionTimeout: 30_000,
      heartbeatInterval: 3_000,
      fromBeginning: false,
      autoCommit: false,
    },
  });
  expect(consumer().subscribe).toHaveBeenCalledWith({
    topics: ['order.created'],
  });
  expect(consumer().run.mock.calls[0]?.[0]).not.toHaveProperty('autoCommit');

  await consumer().deliver({
    topic: 'order.created',
    value: Buffer.from(JSON.stringify(order)),
    offset: '9007199254740993',
    timestamp: '42',
    key: Buffer.from('order-1'),
    headers: {
      a: Buffer.from('1'),
      b: '2',
      c: [Buffer.from('x'), 'y'],
      d: undefined,
      e: [],
    },
  });

  expect(seen).toEqual([
    {
      orderId: '1',
      recordKey: 'billing:order.created:0:9007199254740993',
      meta: {
        topic: 'order.created',
        partitionId: 0,
        offset: '9007199254740993',
        timestamp: '42',
        partitionKey: 'order-1',
        headers: { a: '1', b: '2', c: 'y' },
      },
    },
  ]);
  expect(consumer().commitOffsets).toHaveBeenCalledWith([
    { topic: 'order.created', partition: 0, offset: '9007199254740994' },
  ]);

  await open(kafka).onDestroy();
  await pending;
  expect(consumer().disconnect).toHaveBeenCalled();
});

test('fromBeginning 与自定义会话参数会传给消费者', async () => {
  const kafka = new SecureKafka();
  const pending = kafka.consume(group('g', pingTopic), { fromBeginning: true });
  await started();
  expect(consumer().subscribe).toHaveBeenCalledWith({
    topics: ['ping'],
  });
  expect(consumer().config.kafkaJS).toMatchObject({
    sessionTimeout: 10_000,
    heartbeatInterval: 1_000,
    allowAutoTopicCreation: true,
    fromBeginning: true,
    autoCommit: false,
  });
  await open(kafka).onDestroy();
  await pending;
});

test('groupId 为空、重复消费会被拒绝', async () => {
  const kafka = new ShopKafka();
  expect(() => new KafkaConsumer({ groupId: '' })).toThrow(i18n.t('empty_group_id'));

  const pending = kafka.consume(group('billing', orderCreatedTopic));
  await started();
  await expect(kafka.consume(group('other', orderCreatedTopic))).rejects.toThrow(
    i18n.t('already_consuming'),
  );
  await open(kafka).onDestroy();
  await pending;
});

test('处理函数抛错时不提交偏移量并结束消费', async () => {
  const kafka = new ShopKafka();
  const pending = kafka.consume(
    group('billing', orderCreatedTopic, () => {
      throw new Error('boom');
    }),
  );
  const assertion = expect(pending).rejects.toThrow('boom');
  await started();
  await expect(
    consumer().deliver({
      topic: 'order.created',
      value: Buffer.from(JSON.stringify(order)),
    }),
  ).rejects.toThrow('boom');
  await assertion;
  expect(consumer().commitOffsets).not.toHaveBeenCalled();
  expect(consumer().disconnect).toHaveBeenCalled();
});

test('断开未完成时仍互斥，结束后才能再消费', async () => {
  const kafka = new ShopKafka();
  const pending = kafka.consume(
    group('billing', orderCreatedTopic, () => {
      throw new Error('boom');
    }),
  );
  const assertion = expect(pending).rejects.toThrow('boom');
  await started();
  const gate = Promise.withResolvers<void>();
  const current = consumer();
  current.disconnect.mockImplementationOnce(async () => {
    await gate.promise;
    await current.stop();
  });
  await expect(
    current.deliver({
      topic: 'order.created',
      value: Buffer.from(JSON.stringify(order)),
    }),
  ).rejects.toThrow('boom');
  await expect(kafka.consume(group('billing', orderCreatedTopic))).rejects.toThrow(
    i18n.t('already_consuming'),
  );
  gate.resolve();
  await assertion;

  const next = kafka.consume(group('billing', orderCreatedTopic));
  await started();
  await open(kafka).onDestroy();
  await next;
});

test('一条失败后，仍在处理中的消息不再提交', async () => {
  const kafka = new ShopKafka();
  let hits = 0;
  const gate = Promise.withResolvers<void>();
  const pending = kafka.consume(
    group('billing', orderCreatedTopic, async () => {
      hits += 1;
      if (hits === 1) {
        await gate.promise;
        return;
      }
      throw new Error('boom');
    }),
  );
  const assertion = expect(pending).rejects.toThrow('boom');
  await started();

  const slowOk = consumer().deliver({
    topic: 'order.created',
    partition: 0,
    offset: '1',
    value: Buffer.from(JSON.stringify(order)),
  });
  await vi.waitUntil(() => hits >= 1);

  await expect(
    consumer().deliver({
      topic: 'order.created',
      partition: 1,
      offset: '2',
      value: Buffer.from(JSON.stringify({ orderId: '2', amount: 3 })),
    }),
  ).rejects.toThrow('boom');

  gate.resolve();
  await slowOk;
  await assertion;

  expect(hits).toBe(2);
  expect(consumer().commitOffsets).not.toHaveBeenCalled();
});

test('失败后客户端继续调度的消息会被直接跳过', async () => {
  const kafka = new ShopKafka();
  let hits = 0;
  const pending = kafka.consume(
    group('billing', orderCreatedTopic, () => {
      hits += 1;
      throw new Error('boom');
    }),
  );
  const assertion = expect(pending).rejects.toThrow('boom');
  await started();
  await expect(
    consumer().deliver({
      topic: 'order.created',
      value: Buffer.from(JSON.stringify(order)),
    }),
  ).rejects.toThrow('boom');
  await consumer().deliver({
    topic: 'order.created',
    offset: '9',
    value: Buffer.from(JSON.stringify({ orderId: '9', amount: 1 })),
  });
  await assertion;
  expect(hits).toBe(1);
  expect(consumer().commitOffsets).not.toHaveBeenCalled();
});

test('空消息、非法 JSON、未知主题、非法偏移量都不提交', async () => {
  const cases: Array<{
    message: Parameters<MockConsumer['deliver']>[0];
    text: string;
  }> = [
    {
      message: { topic: 'order.created', value: null },
      text: i18n.t('empty_message'),
    },
    {
      message: { topic: 'order.created', value: Buffer.from('{') },
      text: i18n.t('invalid_json'),
    },
    {
      message: { topic: 'other', value: Buffer.from('{}') },
      text: i18n.t('unknown_topic', { topic: 'other' }),
    },
    {
      message: {
        topic: 'order.created',
        value: Buffer.from(JSON.stringify(order)),
        offset: 'nope',
      },
      text: i18n.t('invalid_offset', { offset: 'nope' }),
    },
  ];

  for (const item of cases) {
    state.clients.length = 0;
    const kafka = new ShopKafka();
    const pending = kafka.consume(group('billing', orderCreatedTopic));
    const assertion = expect(pending).rejects.toThrow(item.text);
    await started();
    await expect(consumer().deliver(item.message)).rejects.toThrow(item.text);
    await assertion;
    expect(consumer().commitOffsets).not.toHaveBeenCalled();
  }
});

test('消息体不符合规则时不提交偏移量', async () => {
  const kafka = new ShopKafka();
  const pending = kafka.consume(group('billing', orderCreatedTopic));
  const assertion = expect(pending).rejects.toThrow('必须为字符串');
  await started();
  await expect(
    consumer().deliver({
      topic: 'order.created',
      value: Buffer.from(JSON.stringify({ orderId: 1, amount: 20 })),
    }),
  ).rejects.toThrow('必须为字符串');
  await assertion;
  expect(consumer().commitOffsets).not.toHaveBeenCalled();
});

test('规则会去掉未声明的字段后再交给处理函数', async () => {
  const kafka = new ShopKafka();
  const seen: unknown[] = [];
  const pending = kafka.consume(
    group('billing', orderCreatedTopic, (ctx) => {
      seen.push(ctx.value);
    }),
  );
  await started();
  await consumer().deliver({
    topic: 'order.created',
    value: Buffer.from(JSON.stringify({ ...order, extra: true })),
  });
  expect(seen).toEqual([order]);
  expect(consumer().commitOffsets).toHaveBeenCalledTimes(1);
  await open(kafka).onDestroy();
  await pending;
});

test('超过大小限制的入站消息不解析', async () => {
  const kafka = new TinyKafka();
  const pending = kafka.consume(
    group('billing', orderCreatedTopic, () => {
      throw new Error('should not run');
    }),
  );
  const assertion = expect(pending).rejects.toThrow(/消息大小超过限制/);
  await started();
  await expect(
    consumer().deliver({
      topic: 'order.created',
      value: Buffer.from('{}'),
      key: Buffer.from('abcd'),
      headers: { name: 'value' },
    }),
  ).rejects.toThrow(/消息大小超过限制/);
  await assertion;
});

test('消费者连接失败后可以再次消费', async () => {
  const kafka = new ShopKafka();
  state.consumerConnectError = new Error('no broker');
  await expect(kafka.consume(group('billing', orderCreatedTopic))).rejects.toThrow(
    'no broker',
  );

  state.consumerConnectError = undefined;
  const pending = kafka.consume(group('billing', orderCreatedTopic));
  await started();
  await open(kafka).onDestroy();
  await pending;
});

test('不可恢复的崩溃会结束消费，可恢复的崩溃不会', async () => {
  const kafka = new ShopKafka();
  const pending = kafka.consume(group('billing', orderCreatedTopic));
  await started();
  consumer().emitCrash(new Error('blip'), true);
  await Promise.resolve();
  let settled = false;
  void pending.then(
    () => {
      settled = true;
    },
    () => {
      settled = true;
    },
  );
  await Promise.resolve();
  expect(settled).toBe(false);

  const crashed = expect(pending).rejects.toThrow('fatal');
  consumer().emitCrash(new Error('fatal'), false);
  await crashed;
  expect(consumer().disconnect).toHaveBeenCalled();
});

test('未请求停止时忽略 STOP', async () => {
  const kafka = new ShopKafka();
  const pending = kafka.consume(group('billing', orderCreatedTopic));
  await started();
  await consumer().stop();
  let settled = false;
  void pending.then(
    () => {
      settled = true;
    },
    () => {
      settled = true;
    },
  );
  await Promise.resolve();
  expect(settled).toBe(false);
  await open(kafka).onDestroy();
  await pending;
});

test('处理期间按间隔心跳，成功后仍提交偏移量', async () => {
  const kafka = new ShopKafka();
  const gate = Promise.withResolvers<void>();
  const pending = kafka.consume(group('billing', orderCreatedTopic, () => gate.promise));
  await started();
  vi.useFakeTimers();
  const beat = vi.fn(async () => {});
  const handling = consumer().deliver({
    topic: 'order.created',
    value: Buffer.from(JSON.stringify(order)),
    heartbeat: beat,
  });
  await vi.advanceTimersByTimeAsync(3_000);
  expect(beat).toHaveBeenCalledTimes(1);
  gate.resolve();
  await handling;
  expect(consumer().commitOffsets).toHaveBeenCalledTimes(1);
  vi.useRealTimers();
  await open(kafka).onDestroy();
  await pending;
});

test('心跳失败时不提交偏移量', async () => {
  const kafka = new ShopKafka();
  const gate = Promise.withResolvers<void>();
  const pending = kafka.consume(group('billing', orderCreatedTopic, () => gate.promise));
  const assertion = expect(pending).rejects.toThrow('rebalance');
  await started();
  try {
    vi.useFakeTimers();
    const handling = consumer().deliver({
      topic: 'order.created',
      value: Buffer.from(JSON.stringify(order)),
      heartbeat: async () => {
        throw new Error('rebalance');
      },
    });
    await vi.advanceTimersByTimeAsync(3_000);
    gate.resolve();
    await expect(handling).rejects.toThrow('rebalance');
    await assertion;
    expect(consumer().commitOffsets).not.toHaveBeenCalled();
  } finally {
    vi.useRealTimers();
  }
});

test('heartbeatInterval 小于等于 0 时不自动心跳', async () => {
  const kafka = new QuietHeartbeatKafka();
  const pending = kafka.consume(group('billing', orderCreatedTopic));
  await started();
  const beat = vi.fn(async () => {});
  await consumer().deliver({
    topic: 'order.created',
    value: Buffer.from(JSON.stringify(order)),
    heartbeat: beat,
  });
  expect(beat).not.toHaveBeenCalled();
  expect(consumer().config.kafkaJS.heartbeatInterval).toBeUndefined();
  expect(consumer().commitOffsets).toHaveBeenCalledTimes(1);
  await open(kafka).onDestroy();
  await pending;
});

test('encode 与 decode 可以替换默认 JSON', async () => {
  const kafka = new PrefixedKafka();
  await kafka.produce({ topic: orderCreatedTopic, value: order });
  const sent = producer().send.mock.calls[0]?.[0] as {
    messages: WireMessage[];
  };
  expect(sent.messages[0]?.value.subarray(0, 3).toString()).toBe('v1:');

  const pending = kafka.consume(
    group('billing', orderCreatedTopic, (ctx) => {
      expect(ctx.value).toEqual(order);
    }),
  );
  await started();
  const body = Buffer.concat([Buffer.from('v1:'), Buffer.from(JSON.stringify(order))]);
  await consumer().deliver({ topic: 'order.created', value: body });
  await open(kafka).onDestroy();
  await pending;
});

test('recordKey 包含分组、主题、分区和偏移量', async () => {
  const kafka = new ShopKafka();
  const seen: string[] = [];
  const pending = kafka.consume(
    group('bill:ing', orderCreatedTopic, (ctx) => {
      seen.push(ctx.recordKey);
    }),
  );
  await started();
  await consumer().deliver({
    topic: 'order.created',
    partition: 2,
    offset: '9',
    value: Buffer.from(JSON.stringify(order)),
  });
  expect(seen).toEqual(['bill%3Aing:order.created:2:9']);
  await open(kafka).onDestroy();
  await pending;
});

test('ctx.logger 与 createKafkaService 传入的相同', async () => {
  const kafka = new ShopKafka();
  let seen: Logger | undefined;
  const pending = kafka.consume(
    group('billing', orderCreatedTopic, (ctx) => {
      seen = ctx.logger;
    }),
  );
  await started();
  await consumer().deliver({
    topic: 'order.created',
    value: Buffer.from(JSON.stringify(order)),
  });
  expect(seen).toBe(testLogger);
  await open(kafka).onDestroy();
  await pending;
});

test('middleware.kafka 产出 KafkaMiddleware', () => {
  const md = middleware.kafka(async (_ctx, next) => next());
  expect(md).toBeInstanceOf(KafkaMiddleware);
  expect(
    middleware.kafka({
      fn: async (_ctx, next) => next(),
    }),
  ).toBeInstanceOf(KafkaMiddleware);
});

test('middleware.kafka skip 可跳过执行', async () => {
  let ran = false;
  const md = middleware
    .kafka(async (_ctx, next) => {
      ran = true;
      return next();
    })
    .skip(true);
  await md['fn']({} as Kafka.Context, async () => {});
  expect(ran).toBe(false);
});

test('string/number/boolean/array 主题可生产并消费', async () => {
  const stringTopic = defineKafkaTopic('payload.string', rule.string());
  const numberTopic = defineKafkaTopic('payload.number', rule.number());
  const booleanTopic = defineKafkaTopic('payload.boolean', rule.boolean());
  const arrayTopic = defineKafkaTopic('payload.array', rule.array(rule.string()));
  const kafka = new ShopKafka();

  await kafka.produce({ topic: stringTopic, value: 'hi' });
  await kafka.produce({ topic: numberTopic, value: 3 });
  await kafka.produce({ topic: booleanTopic, value: true });
  await kafka.produce({ topic: arrayTopic, value: ['a', 'b'] });

  const seen: unknown[] = [];
  const billing = new KafkaConsumer({ groupId: 'billing' });
  billing.on(stringTopic, {
    action: (ctx) => {
      seen.push(ctx.value);
    },
  });
  billing.on(numberTopic, {
    action: (ctx) => {
      seen.push(ctx.value);
    },
  });
  billing.on(booleanTopic, {
    action: (ctx) => {
      seen.push(ctx.value);
    },
  });
  billing.on(arrayTopic, {
    action: (ctx) => {
      seen.push(ctx.value);
    },
  });

  const pending = kafka.consume(billing);
  await started();
  await consumer().deliver({
    topic: 'payload.string',
    value: Buffer.from(JSON.stringify('hi')),
  });
  await consumer().deliver({
    topic: 'payload.number',
    value: Buffer.from(JSON.stringify(3)),
  });
  await consumer().deliver({
    topic: 'payload.boolean',
    value: Buffer.from(JSON.stringify(true)),
  });
  await consumer().deliver({
    topic: 'payload.array',
    value: Buffer.from(JSON.stringify(['a', 'b'])),
  });
  expect(seen).toEqual(['hi', 3, true, ['a', 'b']]);
  expect(consumer().commitOffsets).toHaveBeenCalledTimes(4);
  await open(kafka).onDestroy();
  await pending;
});

test('仅主题级 mount 也会注入 ctx', async () => {
  const kafka = new ShopKafka();
  const billing = new KafkaConsumer({ groupId: 'billing' });
  let flagged = false;
  billing.on(orderCreatedTopic, {
    mount: [
      middleware.kafka<{ flagged: true }>(async (ctx, next) => {
        ctx.flagged = true;
        await next();
      }),
    ],
    action: (ctx) => {
      flagged = ctx.flagged;
    },
  });
  const pending = kafka.consume(billing);
  await started();
  await consumer().deliver({
    topic: 'order.created',
    value: Buffer.from(JSON.stringify(order)),
  });
  expect(flagged).toBe(true);
  await open(kafka).onDestroy();
  await pending;
});

test('服务、消费组、主题级 mount 按顺序执行', async () => {
  const steps: string[] = [];
  const kafka = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    mount: [
      middleware.kafka(async (ctx, next) => {
        steps.push('service');
        expect(ctx.logger).toBe(testLogger);
        await next();
      }),
    ],
  }))();

  const billing = new KafkaConsumer({
    groupId: 'billing',
    mount: [
      middleware.kafka(async (_ctx, next) => {
        steps.push('group');
        await next();
      }),
    ],
  });
  billing.on(orderCreatedTopic, {
    mount: [
      middleware.kafka(async (_ctx, next) => {
        steps.push('topic');
        await next();
      }),
    ],
    action: () => {
      steps.push('action');
    },
  });

  const pending = kafka.consume(billing);
  await started();
  await consumer().deliver({
    topic: 'order.created',
    value: Buffer.from(JSON.stringify(order)),
  });
  expect(steps).toEqual(['service', 'group', 'topic', 'action']);
  expect(consumer().commitOffsets).toHaveBeenCalledTimes(1);
  await open(kafka).onDestroy();
  await pending;
});

test('中间件抛错时不提交偏移量', async () => {
  const kafka = new ShopKafka();
  const billing = new KafkaConsumer({ groupId: 'billing' });
  billing.on(orderCreatedTopic, {
    mount: [
      middleware.kafka(async () => {
        throw new Error('blocked');
      }),
    ],
    action: () => {
      throw new Error('不应执行');
    },
  });
  const pending = kafka.consume(billing);
  const assertion = expect(pending).rejects.toThrow('blocked');
  await started();
  await expect(
    consumer().deliver({
      topic: 'order.created',
      value: Buffer.from(JSON.stringify(order)),
    }),
  ).rejects.toThrow('blocked');
  await assertion;
  expect(consumer().commitOffsets).not.toHaveBeenCalled();
});

test('中间件不调用 next 时仍提交偏移量且不跑 action', async () => {
  let actionRan = false;
  const kafka = new ShopKafka();
  const billing = new KafkaConsumer({ groupId: 'billing' });
  billing.on(orderCreatedTopic, {
    mount: [middleware.kafka(async () => {})],
    action: () => {
      actionRan = true;
    },
  });
  const pending = kafka.consume(billing);
  await started();
  await consumer().deliver({
    topic: 'order.created',
    value: Buffer.from(JSON.stringify(order)),
  });
  expect(actionRan).toBe(false);
  expect(consumer().commitOffsets).toHaveBeenCalledTimes(1);
  await open(kafka).onDestroy();
  await pending;
});

test('没有消息头时元数据 headers 为空对象，partitionKey 为空', async () => {
  const kafka = new ShopKafka();
  const seen: Kafka.Meta[] = [];
  const pending = kafka.consume(
    group('billing', orderCreatedTopic, (ctx) => {
      seen.push(ctx.meta);
    }),
  );
  await started();
  await consumer().deliver({
    topic: 'order.created',
    value: Buffer.from(JSON.stringify(order)),
  });
  expect(seen[0]).toMatchObject({ partitionKey: null, headers: {} });
  await open(kafka).onDestroy();
  await pending;
});

test('只消费时关停不会去断生产者', async () => {
  const kafka = new ShopKafka();
  const pending = kafka.consume(group('billing', orderCreatedTopic));
  await started();
  await open(kafka).onDestroy();
  await pending;
  expect(client().producers).toHaveLength(0);
  expect(consumer().disconnect).toHaveBeenCalledTimes(1);
});

test('并发释放消费者只断开一次', async () => {
  const kafka = new ShopKafka();
  const pending = kafka.consume(group('billing', orderCreatedTopic));
  await started();
  const gate = Promise.withResolvers<void>();
  const current = consumer();
  current.disconnect.mockImplementationOnce(async () => {
    await gate.promise;
    await current.stop();
  });
  const first = open(kafka).releaseConsumer();
  const second = open(kafka).releaseConsumer();
  expect(current.disconnect).toHaveBeenCalledTimes(1);
  gate.resolve();
  await first;
  await second;
  await pending;
});

test('combineServices 代理只暴露发送与消费，关停时断开', async () => {
  const services = await combineServices({
    kafka: async () => ShopKafka,
  });
  await services.kafka.produce({ topic: orderCreatedTopic, value: order });
  expect(producer().connect).toHaveBeenCalledTimes(1);

  const pending = services.kafka.consume(group('billing', orderCreatedTopic));
  await started();
  await internalDestroyServices([services]);
  await pending;
  expect(producer().disconnect).toHaveBeenCalledTimes(1);
  expect(consumer().disconnect).toHaveBeenCalledTimes(1);
});

test('与对象原型同名的主题仍能订阅', async () => {
  const constructorTopic = defineKafkaTopic(
    'constructor',
    rule.object({ ok: rule.boolean() }),
  );
  const kafka = new ShopKafka();
  const pending = kafka.consume(group('billing', constructorTopic));
  await started();
  expect(consumer().subscribe).toHaveBeenCalledWith({
    topics: ['constructor'],
  });
  await consumer().deliver({
    topic: 'constructor',
    value: Buffer.from(JSON.stringify({ ok: true })),
  });
  expect(consumer().commitOffsets).toHaveBeenCalledTimes(1);
  await open(kafka).onDestroy();
  await pending;
});

test('登记失败后可以重新消费', async () => {
  const kafka = new ShopKafka();
  await expect(kafka.consume([])).rejects.toThrow(i18n.t('empty_consumers'));
  const pending = kafka.consume(group('billing', orderCreatedTopic));
  await started();
  await open(kafka).onDestroy();
  await pending;
});

test('主题名为空、非法字符、过长会被拒绝', () => {
  const body = rule.object({ ok: rule.boolean() });
  expect(() => defineKafkaTopic('', body)).toThrow(i18n.t('empty_topic'));
  expect(() => defineKafkaTopic('.', body)).toThrow(
    i18n.t('invalid_topic_name', { topic: '.' }),
  );
  expect(() => defineKafkaTopic('..', body)).toThrow(
    i18n.t('invalid_topic_name', { topic: '..' }),
  );
  expect(() => defineKafkaTopic('order created', body)).toThrow(
    i18n.t('invalid_topic_name', { topic: 'order created' }),
  );
  expect(() => defineKafkaTopic('order/created', body)).toThrow(
    i18n.t('invalid_topic_name', { topic: 'order/created' }),
  );
  expect(() => defineKafkaTopic('中文主题', body)).toThrow(
    i18n.t('invalid_topic_name', { topic: '中文主题' }),
  );
  expect(() => defineKafkaTopic('a'.repeat(250), body)).toThrow(
    i18n.t('topic_name_too_long', { length: '250', max: '249' }),
  );
  expect(defineKafkaTopic('a'.repeat(249), body).name).toHaveLength(249);
  expect(defineKafkaTopic('order.created_v1-2', body).name).toBe('order.created_v1-2');
});

test('同一实例重复登记主题会被拒绝', () => {
  const consumer = new KafkaConsumer({ groupId: 'billing' });
  consumer.on(orderCreatedTopic, { action: () => {} });
  expect(() => consumer.on(orderCreatedTopic, { action: () => {} })).toThrow(
    i18n.t('duplicate_topic', { topic: 'order.created' }),
  );
});

test('disabled 的主题不会登记，全部禁用则直接结束', async () => {
  const kafka = new ShopKafka();
  const blank = new KafkaConsumer({ groupId: 'billing' });
  blank.on(orderCreatedTopic, { disabled: true, action: () => {} });
  await expect(kafka.consume(blank)).resolves.toBeUndefined();
  expect(state.clients).toHaveLength(0);

  const seen: string[] = [];
  const billing = new KafkaConsumer({ groupId: 'billing' });
  billing.on(orderCreatedTopic, {
    disabled: true,
    action: () => {
      seen.push('order');
    },
  });
  billing.on(userRegisteredTopic, {
    action: (ctx) => {
      seen.push(ctx.value.userId);
    },
  });
  const pending = kafka.consume(billing);
  await started();
  expect(consumer().subscribe).toHaveBeenCalledWith({
    topics: ['user.registered'],
  });
  await consumer().deliver({
    topic: 'user.registered',
    value: Buffer.from(JSON.stringify({ userId: 'u' })),
  });
  expect(seen).toEqual(['u']);
  await open(kafka).onDestroy();
  await pending;
});

test('没有消费者、groupId 不一致、主题跨实例重复都会拒绝；空登记则跳过', async () => {
  const kafka = new ShopKafka();
  await expect(kafka.consume([])).rejects.toThrow(i18n.t('empty_consumers'));
  await expect(
    kafka.consume(new KafkaConsumer({ groupId: 'billing' })),
  ).resolves.toBeUndefined();
  await expect(
    kafka.consume([group('billing', orderCreatedTopic), group('notify', pingTopic)]),
  ).rejects.toThrow(i18n.t('mixed_group_id'));
  await expect(
    kafka.consume([
      group('billing', orderCreatedTopic),
      group('billing', orderCreatedTopic),
    ]),
  ).rejects.toThrow(i18n.t('duplicate_topic', { topic: 'order.created' }));
  expect(state.clients).toHaveLength(0);
});

test('多个消费者实例合并成一次订阅', async () => {
  const kafka = new ShopKafka();
  const blank = new KafkaConsumer({ groupId: 'billing' });
  const pending = kafka.consume([
    blank,
    group('billing', orderCreatedTopic),
    group('billing', userRegisteredTopic),
  ]);
  await started();
  expect(consumer().subscribe).toHaveBeenCalledWith({
    topics: ['order.created', 'user.registered'],
  });
  await open(kafka).onDestroy();
  await pending;
});

test('目录扫描只收集 KafkaConsumer，并拒绝非法组合', async () => {
  const root = import.meta.dirname;
  const kafka = new ShopKafka();
  const pending = kafka.consume(join(root, 'fixtures/billing'));
  await started();
  const topics = consumer().subscribe.mock.calls[0]?.[0].topics ?? [];
  expect([...topics].sort()).toEqual(['order.created', 'user.registered']);
  expect(consumer().config.kafkaJS.groupId).toBe('billing');
  await open(kafka).onDestroy();
  await pending;

  await expect(new ShopKafka().consume(join(root, 'fixtures/mixed'))).rejects.toThrow(
    i18n.t('mixed_group_id'),
  );
  await expect(new ShopKafka().consume(join(root, 'fixtures/duplicate'))).rejects.toThrow(
    i18n.t('duplicate_topic', { topic: 'order.created' }),
  );
  await expect(
    new ShopKafka().consume(join(root, 'fixtures/blank')),
  ).resolves.toBeUndefined();
  await expect(new ShopKafka().consume(join(root, 'fixtures/empty'))).rejects.toThrow(
    i18n.t('empty_consumers'),
  );
});

test('TLS 对象映射成证书配置，布尔值只表示开关', async () => {
  const mapped = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    ssl: {
      ca: ['ca-a', null, Buffer.from('ca-b')] as never,
      cert: 'cert',
      key: ['k1', Buffer.from('k2')],
      passphrase: 'secret',
      rejectUnauthorized: false,
    },
  }))();
  await mapped.produce({ topic: pingTopic, value: { ok: true } });
  expect(client().config).toMatchObject({
    'kafkaJS': { ssl: true, logLevel: 2 },
    'enable.ssl.certificate.verification': false,
    'ssl.ca.pem': 'ca-a\n\nca-b',
    'ssl.certificate.pem': 'cert',
    'ssl.key.pem': 'k1\nk2',
    'ssl.key.password': 'secret',
  });

  const enabled = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    ssl: true,
  }))();
  await enabled.produce({ topic: pingTopic, value: { ok: true } });
  expect(client().config).toMatchObject({
    'message.max.bytes': 1_048_576,
    'kafkaJS': {
      clientId: 'test',
      brokers: ['broker:9092'],
      logLevel: 2,
      ssl: true,
    },
  });

  const bare = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    ssl: {},
  }))();
  await bare.produce({ topic: pingTopic, value: { ok: true } });
  expect(client().config).toMatchObject({
    'message.max.bytes': 1_048_576,
    'kafkaJS': {
      clientId: 'test',
      brokers: ['broker:9092'],
      logLevel: 2,
      ssl: true,
    },
  });
});

test('无法编码的 TLS 私钥会被拒绝，且不会创建客户端', async () => {
  const kafka = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    ssl: { key: { pem: 'nope' } as never },
  }))();
  await expect(kafka.produce({ topic: pingTopic, value: { ok: true } })).rejects.toThrow(
    i18n.t('unsupported_tls', { name: 'key' }),
  );
  expect(state.clients).toHaveLength(0);
});

test('AWS 登录在当前客户端不可用，且不会占住消费', async () => {
  const kafka = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    sasl: {
      mechanism: 'aws',
      authorizationIdentity: 'id',
      accessKeyId: 'ak',
      secretAccessKey: 'sk',
    },
  }))();
  const message = i18n.t('unsupported_sasl', { mechanism: 'aws' });
  await expect(kafka.produce({ topic: pingTopic, value: { ok: true } })).rejects.toThrow(
    message,
  );
  await expect(kafka.consume(group('billing', orderCreatedTopic))).rejects.toThrow(
    message,
  );
  await expect(kafka.consume(group('billing', orderCreatedTopic))).rejects.toThrow(
    message,
  );
  expect(state.clients).toHaveLength(0);
});

test('OAUTHBEARER 会补上客户端要求的 principal 和 lifetime', async () => {
  const kafka = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    sasl: {
      mechanism: 'oauthbearer',
      oauthBearerProvider: async () => ({ value: 'tok' }),
    },
  }))();
  await kafka.produce({ topic: pingTopic, value: { ok: true } });
  const sasl = client().config['kafkaJS'] as {
    sasl?: {
      mechanism: string;
      oauthBearerProvider?: () => Promise<{
        value: string;
        principal: string;
        lifetime: number;
      }>;
    };
  };
  const provide = sasl.sasl?.oauthBearerProvider;
  if (!provide) throw new Error('缺少 oauthBearerProvider');
  const before = Date.now();
  const token = await provide();
  expect(sasl.sasl?.mechanism).toBe('oauthbearer');
  expect(token).toMatchObject({ value: 'tok', principal: '' });
  expect(token.lifetime).toBeGreaterThanOrEqual(before + 3_600_000);
  expect(token.lifetime).toBeLessThanOrEqual(Date.now() + 3_600_000);
});

test('SCRAM 登录原样传给客户端', async () => {
  const kafka = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    sasl: { mechanism: 'scram-sha-512', username: 'user', password: 'secret' },
  }))();
  await kafka.produce({ topic: pingTopic, value: { ok: true } });
  expect(client().config).toMatchObject({
    kafkaJS: {
      logLevel: 2,
      sasl: { mechanism: 'scram-sha-512', username: 'user', password: 'secret' },
    },
  });
});

test('客户端日志经适配器写入应用 logger，默认 WARN，不转发 extra', async () => {
  const kafka = new ShopKafka();
  await open(kafka).onInit();
  const logger = (
    client().config['kafkaJS'] as {
      logger: {
        info: (message: string, extra?: object) => void;
        warn: (message: string, extra?: object) => void;
        error: (message: string, extra?: object) => void;
        debug: (message: string, extra?: object) => void;
        setLogLevel: (level: number) => void;
        namespace: () => unknown;
      };
    }
  ).logger;

  const info = vi.spyOn(testLogger, 'info');
  const warn = vi.spyOn(testLogger, 'warn');
  const error = vi.spyOn(testLogger, 'error');
  const debug = vi.spyOn(testLogger, 'debug');

  logger.info('i', { secret: 'x' });
  logger.debug('d', { secret: 'x' });
  logger.warn('w', { secret: 'x' });
  logger.error('e', { secret: 'x' });
  expect(info).not.toHaveBeenCalled();
  expect(debug).not.toHaveBeenCalled();
  expect(warn).toHaveBeenCalledExactlyOnceWith('w');
  expect(error).toHaveBeenCalledExactlyOnceWith('e');

  logger.setLogLevel(4);
  logger.info('i2');
  logger.debug('d2');
  expect(info).toHaveBeenCalledExactlyOnceWith('i2');
  expect(debug).toHaveBeenCalledExactlyOnceWith('d2');
  expect(logger.namespace()).toBe(logger);

  info.mockRestore();
  warn.mockRestore();
  error.mockRestore();
  debug.mockRestore();
});

test('客户端没有崩溃事件时关停仍能结束消费', async () => {
  state.omitConsumerEvents = true;
  const kafka = new ShopKafka();
  const pending = kafka.consume(group('billing', orderCreatedTopic));
  await started();
  expect(consumer().events).toBeUndefined();
  expect(consumer().on).toBeUndefined();
  await open(kafka).onDestroy();
  await pending;
});

test('有崩溃事件名但没有监听方法时关停仍能结束消费', async () => {
  state.omitConsumerOn = true;
  const kafka = new ShopKafka();
  const pending = kafka.consume(group('billing', orderCreatedTopic));
  await started();
  expect(consumer().events?.CRASH).toBe('consumer.crash');
  expect(consumer().on).toBeUndefined();
  await open(kafka).onDestroy();
  await pending;
});

test('协议报文上限跟随消息上限，并限制在客户端允许的范围内', async () => {
  const small = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    maxMessageBytes: 4,
  }))();
  const smallPending = small.consume(group('g', pingTopic));
  await started();
  expect(client().config).toMatchObject({ 'message.max.bytes': 1_000 });
  expect(consumer().config.kafkaJS.maxBytesPerPartition).toBeUndefined();
  expect(consumer().config.kafkaJS.maxBytes).toBeUndefined();
  await open(small).onDestroy();
  await smallPending;

  const medium = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    maxMessageBytes: 2_000_000,
  }))();
  const mediumPending = medium.consume(group('g', pingTopic));
  await started();
  expect(client().config).toMatchObject({ 'message.max.bytes': 2_000_000 });
  expect(consumer().config.kafkaJS.maxBytesPerPartition).toBe(2_000_000);
  expect(consumer().config.kafkaJS.maxBytes).toBeUndefined();
  await open(medium).onDestroy();
  await mediumPending;

  const large = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    maxMessageBytes: 20_000_000,
  }))();
  const largePending = large.consume(group('g', pingTopic));
  await started();
  expect(consumer().config.kafkaJS).toMatchObject({
    maxBytesPerPartition: 20_000_000,
    maxBytes: 20_000_000,
  });
  await open(large).onDestroy();
  await largePending;

  const capped = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    maxMessageBytes: 2_000_000_000,
  }))();
  await capped.produce({ topic: pingTopic, value: { ok: true } });
  expect(client().config).toMatchObject({ 'message.max.bytes': 1_000_000_000 });
});

test('未设置心跳时不超过会话超时的三分之一', async () => {
  expect(() =>
    createKafkaService({
      clientId: 'test',

      logger: testLogger,
      brokers: ['broker:9092'],
      sessionTimeout: '6s',
      heartbeatInterval: '6s',
    }),
  ).toThrow(i18n.t('heartbeat_exceeds_session'));
  expect(state.clients).toHaveLength(0);

  const tuned = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    sessionTimeout: '6s',
  }))();
  const tunedPending = tuned.consume(group('g', pingTopic));
  await started();
  expect(consumer().config.kafkaJS.heartbeatInterval).toBe(2_000);
  await open(tuned).onDestroy();
  await tunedPending;

  const kept = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    sessionTimeout: '6s',
    heartbeatInterval: '5999ms',
  }))();
  const keptPending = kept.consume(group('g', pingTopic));
  await started();
  expect(consumer().config.kafkaJS.heartbeatInterval).toBe(5_999);
  await open(kept).onDestroy();
  await keptPending;

  const floor = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    sessionTimeout: '2ms',
  }))();
  const floorPending = floor.consume(group('g', pingTopic));
  await started();
  expect(consumer().config.kafkaJS.heartbeatInterval).toBe(1);
  await open(floor).onDestroy();
  await floorPending;
});

test('时长不足 1 毫秒时按整数毫秒四舍五入', async () => {
  const kafka = new (createKafkaService({
    clientId: 'test',

    logger: testLogger,
    brokers: ['broker:9092'],
    connectionTimeout: '1.5ms',
    requestTimeout: '2.4ms',
  }))();
  await kafka.produce({ topic: pingTopic, value: { ok: true } });
  expect(client().config).toMatchObject({
    kafkaJS: { connectionTimeout: 2, requestTimeout: 2 },
  });
});

test('非法时长在创建时拒绝', () => {
  expect(() =>
    createKafkaService({
      clientId: 'test',

      logger: testLogger,
      brokers: ['broker:9092'],
      connectionTimeout: -1,
    }),
  ).toThrow(RangeError);
  expect(() =>
    createKafkaService({
      clientId: 'test',

      logger: testLogger,
      brokers: ['broker:9092'],
      // @ts-expect-error 无单位字符串不是 DurationInput，运行时仍拒绝
      requestTimeout: 'soon',
    }),
  ).toThrow(TypeError);
  expect(() =>
    createKafkaService({
      clientId: 'test',

      logger: testLogger,
      brokers: ['broker:9092'],
      sessionTimeout: Number.NaN,
    }),
  ).toThrow(RangeError);
  expect(state.clients).toHaveLength(0);
});

test('异步加载语言包', async () => {
  await ensureI18nLanguage('ja-JP');
  expect(i18n.t('empty_brokers', undefined, 'ja-JP')).toBe('brokers を空にはできません');
  await ensureI18nLanguage('zh-TW');
  expect(i18n.t('empty_brokers', undefined, 'zh-TW')).toBe('brokers 不能為空');
  await ensureI18nLanguage('de-DE');
  expect(i18n.t('empty_brokers', undefined, 'de-DE')).toBe(
    'brokers darf nicht leer sein',
  );
  expect(i18n.t('empty_brokers', undefined, 'en-US')).toBe('brokers must not be empty');
  expect(i18n.t('empty_brokers', undefined, 'zh-CN')).toBe('brokers 不能为空');
  await ensureI18nLanguage('zh-CN');
});
