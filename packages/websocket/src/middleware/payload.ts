import {
  middleware,
  toDocument,
  validate,
  ValidateDeniedError,
  type Validator,
  type ValidatorToken,
} from '@aomex/common';
import type { SocketMiddleware } from '../override';
import type { WebsocketContext } from '../core/context';
import '../override/socket-middleware.js';

/**
 * 校验入站帧的 `data`，成功则写入 `ctx.payload`；失败则向当前连接推送
 * `{ event: 'error', data: { message } }` 且不进入 `action`。
 *
 * AsyncAPI：只填入站 `message.payload`（骨架由生成器预建）。
 *
 * ```ts
 * import { payload } from '@aomex/websocket';
 * import { rule } from '@aomex/common';
 *
 * channel.on('chat.send', {
 *   mount: [
 *     payload({
 *       roomId: rule.string(),
 *       text: rule.string().max(2000),
 *     }),
 *   ],
 *   action: async (ctx) => {
 *     // ctx.payload 已推断为 { roomId: string; text: string }
 *     await ctx.room(ctx.payload.roomId).send('chat.message', ctx.payload, {
 *       except: ctx.client,
 *     });
 *   },
 * });
 * ```
 *
 * 入参为 `ValidatorToken`（字段表 / `rule.object()` / 标量 / `ValidatorSchema`），与 `body()` / `query()` 相同。
 */
export const payload = <T extends ValidatorToken>(
  fields: T,
): SocketMiddleware<{ readonly payload: Validator.Infer<T> }> => {
  return middleware.socket<{ readonly payload: Validator.Infer<T> }>({
    fn: async (ctx, next) => {
      const wsCtx = ctx as WebsocketContext & {
        payload: Validator.Infer<T>;
      };
      try {
        wsCtx.payload = (await validate(wsCtx.rawPayload, fields)) as Validator.Infer<T>;
        return next();
      } catch (e) {
        const message =
          e instanceof ValidateDeniedError || e instanceof Error ? e.message : String(e);
        await wsCtx.client.send('error', { message });
      }
    },
    asyncapi: {
      onEvent({ message }) {
        message.payload = {
          schemaFormat: 'application/vnd.oai.openapi;version=3.2.0',
          schema: toDocument(fields).schema,
        };
      },
    },
  });
};
