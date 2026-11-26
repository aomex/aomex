import {
  combineServices,
  Middleware,
  middleware,
  rule,
  type Next,
  type PromisifiedService,
} from '@aomex/common';
import { Logger } from '@aomex/logger';
import { expectType, type TypeEqual } from 'ts-expect';
import {
  createKafkaService,
  defineKafkaTopic,
  KafkaConsumer,
  KafkaMiddleware,
  KafkaTopic,
  type Kafka,
  type KafkaMiddlewareToken,
} from '../src';

declare const logger: Logger;

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
    id: rule.string().optional(),
    note: rule.string().nullable(),
    tags: rule.array(rule.string()),
  }),
);

const tickTopic = defineKafkaTopic(
  'tick',
  rule.oneOf([
    rule.object({ kind: rule.literal('a'), n: rule.number() }),
    rule.object({ kind: rule.literal('b'), s: rule.string() }),
  ]),
);

const emptyTopic = defineKafkaTopic('empty', rule.object({}));

const ShopKafka = createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
});
type ShopKafka = InstanceType<typeof ShopKafka>;

declare const kafka: ShopKafka;

const receipts = await kafka.produce({
  topic: orderCreatedTopic,
  value: { orderId: '1', amount: 2 },
});
expectType<TypeEqual<readonly Kafka.Receipt[], typeof receipts>>(true);

await kafka.produce({
  topic: orderCreatedTopic,
  value: { orderId: '1', amount: 2 },
  partitionKey: 'k',
  headers: { a: 'b' },
  partitionId: 0,
});

await kafka.produceMany([
  { topic: orderCreatedTopic, value: { orderId: '1', amount: 2 } },
  { topic: userRegisteredTopic, value: { userId: 'u' }, partitionKey: 'u' },
]);
await kafka.produceMany([]);

await kafka.produce({ topic: pingTopic, value: { note: null, tags: ['a'] } });
await kafka.produce({ topic: tickTopic, value: { kind: 'b', s: 'x' } });
await kafka.produce({ topic: emptyTopic, value: {} });

const billing = new KafkaConsumer({ groupId: 'billing' });
billing.on(orderCreatedTopic, {
  action: (ctx) => {
    expectType<Kafka.Context<{ orderId: string; amount: number }>>(ctx);
    expectType<TypeEqual<{ orderId: string; amount: number }, typeof ctx.value>>(true);
    expectType<TypeEqual<Logger, typeof ctx.logger>>(true);
    expectType<TypeEqual<string, typeof ctx.recordKey>>(true);
    expectType<TypeEqual<Kafka.Meta, typeof ctx.meta>>(true);
    expectType<TypeEqual<string | null, typeof ctx.meta.partitionKey>>(true);
    expectType<TypeEqual<number, typeof ctx.meta.partitionId>>(true);
    expectType<TypeEqual<string, typeof ctx.meta.topic>>(true);
    expectType<TypeEqual<string, typeof ctx.meta.offset>>(true);
    expectType<TypeEqual<string, typeof ctx.meta.timestamp>>(true);
    expectType<TypeEqual<Record<string, string>, typeof ctx.meta.headers>>(true);
    // @ts-expect-error Meta 已聚合到 ctx.meta，顶层不再有这些字段
    ctx.partitionKey;
    // @ts-expect-error Meta 已聚合到 ctx.meta，顶层不再有这些字段
    ctx.topic;
    // @ts-expect-error recordKey 在 ctx 顶层，不在 meta 内
    ctx.meta.recordKey;
    // @ts-expect-error 已改名为 partitionKey
    ctx.meta.key;
    // @ts-expect-error 已改名为 partitionId
    ctx.meta.partition;
  },
});

{
  const md = middleware.kafka<{ tagged: true }>((ctx, next) => {
    expectType<TypeEqual<Kafka.Context & { tagged: true }, typeof ctx>>(true);
    expectType<Logger>(ctx.logger);
    expectType<Next>(next);
    return next();
  });
  expectType<KafkaMiddleware<{ tagged: true }>>(md);

  middleware.kafka({
    fn: (ctx, next) => {
      expectType<TypeEqual<object & Kafka.Context, typeof ctx>>(true);
      expectType<Next>(next);
    },
  });

  const withMount = new KafkaConsumer({
    groupId: 'billing',
    mount: [md],
  });
  withMount.on(orderCreatedTopic, {
    mount: [middleware.mixin<{ note: string }>(() => {})],
    action: (ctx) => {
      expectType<TypeEqual<true, typeof ctx.tagged>>(true);
      expectType<TypeEqual<string, typeof ctx.note>>(true);
      expectType<TypeEqual<Logger, typeof ctx.logger>>(true);
    },
  });

  new KafkaConsumer({ groupId: 'solo' }).on(orderCreatedTopic, {
    mount: [middleware.kafka<{ onlyTopic: true }>(() => {})],
    action: (ctx) => {
      expectType<TypeEqual<true, typeof ctx.onlyTopic>>(true);
      // @ts-expect-error 未挂消费组 mount 时没有 tagged
      ctx.tagged;
    },
  });

  const upstream = middleware.kafka<{ userId: number }>(() => {});
  const dependent = middleware.dependsOn(upstream).kafka((ctx) => {
    expectType<TypeEqual<Kafka.Context & { userId: number }, typeof ctx>>(true);
  });
  expectType<TypeEqual<object, Middleware.Infer<typeof dependent>>>(true);
  expectType<KafkaMiddleware<object>>(dependent);

  type Token = KafkaMiddlewareToken<{ a: 1 }>;
  expectType<
    TypeEqual<
      KafkaMiddleware<{ a: 1 }> | import('@aomex/common').MixinMiddleware<{ a: 1 }>,
      Token
    >
  >(true);

  createKafkaService({
    clientId: 'shop',
    logger,
    brokers: ['127.0.0.1:9092'],
    mount: [md, middleware.mixin(() => {})],
  });
}

{
  const stringTopic = defineKafkaTopic('payload.string', rule.string());
  const numberTopic = defineKafkaTopic('payload.number', rule.number());
  const booleanTopic = defineKafkaTopic('payload.boolean', rule.boolean());
  const arrayTopic = defineKafkaTopic('payload.array', rule.array(rule.string()));

  await kafka.produce({ topic: stringTopic, value: 'hi' });
  await kafka.produce({ topic: numberTopic, value: 1 });
  await kafka.produce({ topic: booleanTopic, value: false });
  await kafka.produce({ topic: arrayTopic, value: ['a'] });

  // @ts-expect-error string 主题不能传 number
  await kafka.produce({ topic: stringTopic, value: 1 });
  // @ts-expect-error number 主题不能传 string
  await kafka.produce({ topic: numberTopic, value: '1' });
  // @ts-expect-error boolean 主题不能传 string
  await kafka.produce({ topic: booleanTopic, value: 'true' });
  // @ts-expect-error array 元素类型不匹配
  await kafka.produce({ topic: arrayTopic, value: [1] });

  new KafkaConsumer({ groupId: 'billing' }).on(stringTopic, {
    action: (ctx) => {
      expectType<TypeEqual<string, typeof ctx.value>>(true);
    },
  });
  new KafkaConsumer({ groupId: 'billing' }).on(numberTopic, {
    action: (ctx) => {
      expectType<TypeEqual<number, typeof ctx.value>>(true);
    },
  });
  new KafkaConsumer({ groupId: 'billing' }).on(booleanTopic, {
    action: (ctx) => {
      expectType<TypeEqual<boolean, typeof ctx.value>>(true);
    },
  });
  new KafkaConsumer({ groupId: 'billing' }).on(arrayTopic, {
    action: (ctx) => {
      expectType<TypeEqual<string[], typeof ctx.value>>(true);
    },
  });
}
billing.on(userRegisteredTopic, {
  disabled: false,
  action: async (ctx) => {
    expectType<TypeEqual<{ userId: string }, typeof ctx.value>>(true);
  },
});

billing.on(emptyTopic, {
  disabled: true,
  action: async (ctx) => {
    expectType<TypeEqual<{}, typeof ctx.value>>(true);
  },
});

await kafka.consume(billing);
await kafka.consume('./consumers');
await kafka.consume('./consumers', { fromBeginning: true });
await kafka.consume([billing]);

// @ts-expect-error 主题不存在
await kafka.produce({ topic: 'missing', value: { orderId: '1' } });

// @ts-expect-error amount 必须是 number
await kafka.produce({ topic: orderCreatedTopic, value: { orderId: '1', amount: '2' } });

await kafka.produce({
  topic: orderCreatedTopic,
  // @ts-expect-error 多余字段
  value: { orderId: '1', amount: 1, extra: true },
});

await kafka.produce({
  topic: orderCreatedTopic,
  value: orderValue(),
  // @ts-expect-error header 必须是字符串
  headers: { a: 1 },
});

// @ts-expect-error 已改名为 partitionKey
await kafka.produce({ topic: orderCreatedTopic, value: orderValue(), key: 'k' });

// @ts-expect-error 已改名为 partitionId
await kafka.produce({ topic: orderCreatedTopic, value: orderValue(), partition: 0 });

// @ts-expect-error 不再接受位置参数
await kafka.produce(orderCreatedTopic, { orderId: '1', amount: 2 });

await kafka.produceMany([
  {
    topic: userRegisteredTopic,
    // @ts-expect-error 主题与消息体不匹配
    value: { orderId: '1', amount: 1 },
  },
]);

await kafka.produceMany([
  {
    topic: userRegisteredTopic,
    // @ts-expect-error 多余字段
    value: { userId: 'u', extra: true },
  },
]);

// @ts-expect-error 登记的必须是主题
billing.on('order.created', { action: () => {} });

// @ts-expect-error 请用 defineKafkaTopic，禁止直接 new
new KafkaTopic('order.created', rule.string());

// @ts-expect-error 禁止直接调用受保护的 create
KafkaTopic.create('order.created', rule.string());

defineKafkaTopic(
  'dated',
  // @ts-expect-error Date 不能作为消息体
  rule.object({ at: rule.date() }),
);

defineKafkaTopic(
  'counted',
  // @ts-expect-error bigint 不能作为消息体
  rule.object({ n: rule.bigint() }),
);

defineKafkaTopic(
  'raw',
  // @ts-expect-error Buffer 不能作为消息体
  rule.object({ raw: rule.buffer() }),
);

defineKafkaTopic(
  'nested',
  // @ts-expect-error 嵌套 Date 不能作为消息体
  rule.object({ user: rule.object({ at: rule.date() }) }),
);

defineKafkaTopic(
  'listed',
  // @ts-expect-error 数组元素也不能是 Date
  rule.object({ at: rule.array(rule.date()) }),
);

// @ts-expect-error 必须声明 brokers
createKafkaService({ clientId: 'shop', logger });

// @ts-expect-error 必须声明 logger
createKafkaService({ clientId: 'shop', brokers: ['127.0.0.1:9092'] });

// @ts-expect-error 必须声明 clientId
createKafkaService({ logger, brokers: ['127.0.0.1:9092'] });

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  connectionTimeout: '1s',
  requestTimeout: '30s',
  sessionTimeout: '30s',
  heartbeatInterval: '3s',
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  connectionTimeout: 1_000,
  requestTimeout: 30_000,
  sessionTimeout: 30_000,
  heartbeatInterval: 0,
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  // @ts-expect-error 无单位字符串不是 DurationInput
  connectionTimeout: '1000',
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  // @ts-expect-error 无单位字符串不是 DurationInput
  requestTimeout: '30',
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  // @ts-expect-error 无单位字符串不是 DurationInput
  sessionTimeout: '30',
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  // @ts-expect-error 无单位字符串不是 DurationInput
  heartbeatInterval: '3',
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  // @ts-expect-error acks 只能是 -1 | 0 | 1
  acks: 2,
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  ssl: {
    ca: 'ca',
    cert: Buffer.from('cert'),
    key: ['key'],
    passphrase: 'secret',
    rejectUnauthorized: false,
  },
  sasl: {
    mechanism: 'oauthbearer',
    oauthBearerProvider: async () => ({ value: 'tok' }),
  },
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  sasl: { mechanism: 'scram-sha-256', username: 'u', password: 'p' },
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  sasl: {
    mechanism: 'aws',
    authorizationIdentity: 'id',
    accessKeyId: 'ak',
    secretAccessKey: 'sk',
  },
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  // @ts-expect-error 不存在的 SASL 机制
  sasl: { mechanism: 'none', username: 'u', password: 'p' },
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  sasl: {
    mechanism: 'oauthbearer',
    // @ts-expect-error 令牌必须带 value
    oauthBearerProvider: async () => ({ token: 'tok' }),
  },
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  // @ts-expect-error 未知配置
  nope: true,
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  // @ts-expect-error encode 必须返回 Buffer
  encode: () => 'nope',
});

createKafkaService({
  clientId: 'shop',

  logger,
  brokers: ['127.0.0.1:9092'],
  // @ts-expect-error decode 的入参是 Buffer
  decode: (input: string) => input,
});

const services = await combineServices({
  kafka: async () => ShopKafka,
});

expectType<TypeEqual<{ readonly kafka: PromisifiedService<ShopKafka> }, typeof services>>(
  true,
);

await services.kafka.produce({
  topic: orderCreatedTopic,
  value: { orderId: '1', amount: 2 },
});
await services.kafka.produceMany([
  { topic: userRegisteredTopic, value: { userId: 'u' } },
]);
await services.kafka.consume(billing);

// @ts-expect-error 字段不暴露
services.kafka.brokers;
// @ts-expect-error 生命周期不暴露
services.kafka.onInit;
// @ts-expect-error 生命周期不暴露
services.kafka.onDestroy;
// @ts-expect-error 编码钩子不暴露
services.kafka.encodeValue;

function orderValue(): { orderId: string; amount: number } {
  return { orderId: '1', amount: 1 };
}
