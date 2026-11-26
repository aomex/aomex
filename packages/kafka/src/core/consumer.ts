import { Middleware } from '@aomex/common';
import type { Union2Intersection } from '@aomex/internal-tools';
import { i18n } from '../i18n';
import type { Kafka } from './kafka';
import type { KafkaTopic } from './topic';
import type { KafkaMiddlewareToken } from '../override';
import '../override/kafka-middleware.js';

type KafkaHandler = {
  topic: KafkaTopic<unknown>;
  middlewareList: KafkaMiddlewareToken[];
  action: (ctx: Kafka.Context<unknown>) => void | Promise<void>;
};

export interface KafkaConsumerOptions<T extends KafkaMiddlewareToken[] | [] = []> {
  /**
   * 消费组 ID。同组消费者共同分摊分区；同一次 `consume` 合并的多个实例必须相同。
   */
  groupId: string;
  /**
   * 本消费组下所有主题共用的中间件（先于主题级 `mount` 执行）。
   * 仅 `middleware.kafka` / `middleware.mixin`。
   */
  mount?: T;
}

export interface KafkaHandlerOptions<
  Value,
  Props extends object | unknown,
  T extends KafkaMiddlewareToken[] | [],
> {
  /**
   * 为 `true` 时不登记该主题（便于按环境开关）。
   */
  disabled?: boolean;
  /**
   * 仅本主题的中间件。仅 `middleware.kafka` / `middleware.mixin`。
   */
  mount?: T;
  /**
   * 消费处理函数；`ctx` 类型会合并消费组 / 主题级 `mount` 的 Props，并始终带 `logger`。
   */
  action: (ctx: KafkaConsumer.Context<Value, Props, T>) => void | Promise<void>;
}

export declare namespace KafkaConsumer {
  export type Interface<
    Props extends object | unknown,
    T extends KafkaMiddlewareToken[] | [],
  > = T extends []
    ? Props
    : Props & Union2Intersection<Middleware.CollectArrayType<T[number]>>;

  export type Context<
    Value,
    Props extends object | unknown,
    T extends KafkaMiddlewareToken[] | [],
  > = Kafka.Context<Value> & Interface<Props, T>;
}

/**
 * 一个消费组上的主题登记，用法对齐路由：先 `new`，再 `on`。
 * 建议放在 `src/consumers/`，主题从 `src/topics/*.topic.ts` 引入。
 * 同一目录里的多个实例交给 `consume` 合并，且必须是同一个 `groupId`。
 */
export class KafkaConsumer<
  T extends KafkaMiddlewareToken[] | [] = [],
  Props extends object | unknown = Kafka.Props &
    (T extends [] ? object : Union2Intersection<Middleware.CollectArrayType<T[number]>>),
> {
  readonly groupId: string;
  private readonly middlewareList: KafkaMiddlewareToken[];
  private readonly handlers: KafkaHandler[] = [];

  constructor(options: KafkaConsumerOptions<T>) {
    if (options.groupId.length === 0) {
      throw new Error(i18n.t('empty_group_id'));
    }
    this.groupId = options.groupId;
    this.middlewareList = options.mount || [];
  }

  /**
   * 登记一个主题。`action` 收到 `ctx`，其中 `value` 从该主题的规则推断。
   * 同一个实例里主题名不能重复。
   * `disabled: true` 时不登记。
   */
  public on<V, M extends KafkaMiddlewareToken[] | [] = []>(
    topic: KafkaTopic<V>,
    options: KafkaHandlerOptions<V, Props, M>,
  ): void {
    if (options.disabled === true) return;
    if (this.handlers.some((item) => item.topic.name === topic.name)) {
      throw new Error(i18n.t('duplicate_topic', { topic: topic.name }));
    }
    this.handlers.push({
      topic: topic as KafkaTopic<unknown>,
      middlewareList: [
        ...this.middlewareList,
        ...((options.mount || []) as KafkaMiddlewareToken[]),
      ],
      action: options.action as KafkaHandler['action'],
    });
  }

  protected collect(): readonly KafkaHandler[] {
    return this.handlers;
  }
}
