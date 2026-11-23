import type { AsyncAPI } from '@aomex/common';
import {
  Channel,
  SocketMiddleware,
  type AsyncApiEventContext,
  type AsyncApiInjector,
} from '@aomex/websocket';
import { ensureAsyncApiMessage } from './write-message';

type EventEntry = {
  event: string;
  injectors: AsyncApiInjector[];
  ctx: AsyncApiEventContext;
};

/**
 * 遍历 Channel，预建入站骨架后按中间件链调用 `asyncapi()` 注入器。
 * 顺序对齐 OpenAPI：先建骨架，再 `onDocument` → `onEvent` → `postEvent`(倒序) → `postDocument`(倒序)。
 */
export const parseChannels = (document: AsyncAPI.Document, channels: Channel[]): void => {
  const entries: EventEntry[] = [];

  for (const channel of channels) {
    const channelMount = channel['middlewareList'];
    for (const [event, handler] of channel['handlers']) {
      const list = [...channelMount, ...handler.middlewareList].filter(
        (item): item is SocketMiddleware => item instanceof SocketMiddleware,
      );
      const receive = ensureAsyncApiMessage(document, { event, action: 'receive' });
      entries.push({
        event,
        injectors: list.map((item) => item['asyncapi']()),
        ctx: createEventContext(document, event, receive),
      });
    }
  }

  for (const { injectors } of entries) {
    for (const injector of injectors) {
      injector.onDocument?.(document);
    }
  }

  for (const { injectors, ctx } of entries) {
    for (const injector of injectors) {
      injector.onEvent?.(ctx);
    }
  }

  for (const { injectors, ctx } of entries) {
    for (let i = injectors.length - 1; i >= 0; i--) {
      injectors[i]!.postEvent?.(ctx);
    }
  }

  for (const { injectors } of entries) {
    for (let i = injectors.length - 1; i >= 0; i--) {
      injectors[i]!.postDocument?.(document);
    }
  }
};

const createEventContext = (
  document: AsyncAPI.Document,
  event: string,
  receive: {
    channel: AsyncAPI.ChannelObject;
    message: AsyncAPI.MessageObject;
    operation: AsyncAPI.OperationObject;
  },
): AsyncApiEventContext => ({
  document,
  event,
  channel: receive.channel,
  message: receive.message,
  operation: receive.operation,
  addSend(sendEvent, fill) {
    const send = ensureAsyncApiMessage(document, {
      event: sendEvent,
      action: 'send',
    });
    fill?.(send.message, send.operation);
  },
});
