import { middleware } from '@aomex/common';
import {
  pathToFiles,
  getFileValues,
  type GlobPathOptions,
} from '@aomex/internal-file-import';
import { Channel } from './channel';
import type { SocketMiddleware } from '../override';
import type { EventHandlerMap } from '../core';
import { i18n } from '../i18n';

/**
 * 加载 Channel 并作为 Socket 中间件挂到 `WebsocketApp.mount`（对齐 `routers()`）。
 *
 * 匹配到事件时执行 Channel / 事件级链；未匹配则 `next()`，由外层处理未知事件。
 *
 * ```ts
 * new WebsocketApp({
 *   logger,
 *   language: { mode: 'fixed', language: 'zh-CN' },
 *   transport: new WsTransport(),
 *   mount: [
 *     middleware.socket(async (ctx, next) => next()),
 *     channels('./src/channels'),
 *   ],
 * });
 * ```
 */
export const channels = (options: GlobPathOptions | Channel[]): SocketMiddleware => {
  let handlers: EventHandlerMap | undefined;
  let loadPromise = Promise.resolve();

  if (isChannelList(options)) {
    handlers = mergeChannelHandlers(options);
  } else {
    loadPromise = pathToFiles(options)
      .then((files) =>
        getFileValues<Channel>(files, (item) => !!item && item instanceof Channel),
      )
      .then((list) => {
        handlers = mergeChannelHandlers(list);
      });
  }

  return middleware.socket(async (ctx, next) => {
    if (!handlers) await loadPromise;
    const handler = handlers!.get(ctx.event);
    if (!handler) return next();
    return handler(ctx, next);
  });
};

const isChannelList = (options: GlobPathOptions | Channel[]): options is Channel[] => {
  if (!Array.isArray(options)) return false;
  if (options.length === 0) return true;
  return options[0] instanceof Channel;
};

/** 将多个 Channel 的事件表收成一张；跨 Channel 同名事件抛错 */
const mergeChannelHandlers = (list: Channel[]): EventHandlerMap => {
  const merged: EventHandlerMap = new Map();
  for (const channel of list) {
    for (const [event, fn] of channel['collect']()) {
      if (merged.has(event)) {
        throw new Error(i18n.t('duplicate_event', { event }));
      }
      merged.set(event, fn);
    }
  }
  return merged;
};
