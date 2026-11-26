import { Middleware, MixinMiddleware, type Next } from '@aomex/common';
import type { NonReadonly } from '@aomex/internal-tools';
import type { Kafka } from '../core/kafka';

export type KafkaMiddlewareToken<P extends object = object> =
  KafkaMiddleware<P> | MixinMiddleware<P>;

declare module '@aomex/common' {
  export interface MiddlewarePlatform<Deps extends object = object> {
    readonly kafka: <Props extends object = object>(
      fn:
        | KafkaMiddlewareArguments<Middleware.MergeDeps<Props, Deps>>['fn']
        | KafkaMiddlewareArguments<Middleware.MergeDeps<Props, Deps>>,
    ) => object extends Deps
      ? KafkaMiddleware<Props>
      : KafkaMiddleware<Props> & {
          _contextType: Middleware.WithDeps<Kafka.Context, Deps>;
        };
  }
}

interface KafkaMiddlewareArguments<T extends object> {
  fn: (ctx: NonReadonly<T> & Kafka.Context, next: Next) => any;
}

/**
 * Kafka 消费专用中间件；`KafkaConsumer` / `createKafkaService` 的 `mount` 仅允许本类或 `mixin`。
 */
export class KafkaMiddleware<Props extends object = object> extends Middleware<Props> {
  declare public _contextType: Kafka.Context;
  declare protected _kafka_middleware_: 'kafka-middleware';

  constructor(
    args: KafkaMiddlewareArguments<Props>['fn'] | KafkaMiddlewareArguments<Props>,
  ) {
    const { fn } =
      typeof args === 'function'
        ? ({ fn: args } satisfies KafkaMiddlewareArguments<Props>)
        : args;
    super(fn);
  }
}

Middleware.register('kafka', KafkaMiddleware);
