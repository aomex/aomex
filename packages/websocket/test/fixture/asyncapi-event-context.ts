import type { AsyncAPI } from '@aomex/common';
import type { AsyncApiEventContext } from '../../src';
import { emptyAsyncApiDocument } from './empty-asyncapi';

/**
 * 单测用入站事件上下文（对齐生成器预建骨架 + addSend）。
 * 全量拼凑逻辑在 `@aomex/asyncapi-generator`，此处只方便中间件填鸭断言。
 */
export const createAsyncApiEventContext = (
  event: string,
  document: AsyncAPI.Document = emptyAsyncApiDocument(),
): AsyncApiEventContext => {
  document.channels ||= {};
  document.operations ||= {};
  document.components ||= {};
  document.components.messages ||= {};

  const message: AsyncAPI.MessageObject = {
    name: event,
    contentType: 'application/json',
  };
  document.components.messages[event] = message;

  const channel: AsyncAPI.ChannelObject = {
    address: event,
    messages: {
      [event]: { $ref: `#/components/messages/${event}` },
    },
  };
  document.channels[event] = channel;

  const operation: AsyncAPI.OperationObject = {
    action: 'receive',
    channel: { $ref: `#/channels/${event}` },
    messages: [{ $ref: `#/channels/${event}/messages/${event}` }],
  };
  document.operations[`receive:${event}`] = operation;

  return {
    document,
    event,
    channel,
    message,
    operation,
    addSend(sendEvent, fill) {
      const sendMessage: AsyncAPI.MessageObject = {
        name: sendEvent,
        contentType: 'application/json',
      };
      document.components!.messages![sendEvent] = sendMessage;
      document.channels![sendEvent] = {
        address: sendEvent,
        messages: {
          [sendEvent]: { $ref: `#/components/messages/${sendEvent}` },
        },
      };
      const sendOperation: AsyncAPI.OperationObject = {
        action: 'send',
        channel: { $ref: `#/channels/${sendEvent}` },
        messages: [{ $ref: `#/channels/${sendEvent}/messages/${sendEvent}` }],
      };
      document.operations![`send:${sendEvent}`] = sendOperation;
      fill?.(sendMessage, sendOperation);
    },
  };
};
