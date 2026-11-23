import type { AsyncAPI } from '@aomex/common';

/** JSON Pointer 段转义（`~` → `~0`，`/` → `~1`） */
export const encodeJsonPointerSegment = (segment: string): string =>
  segment.replaceAll('~', '~0').replaceAll('/', '~1');

const isRef = (value: unknown): value is AsyncAPI.ReferenceObject =>
  !!value && typeof value === 'object' && '$ref' in value;

/**
 * 确保 document 上存在某事件的 channel / message / operation 骨架（幂等）。
 * 对齐 OpenAPI `parse-files` 预建 `pathItem` / `methodItem`。
 */
export const ensureAsyncApiMessage = (
  document: AsyncAPI.Document,
  options: {
    event: string;
    action: 'receive' | 'send';
  },
): {
  channel: AsyncAPI.ChannelObject;
  message: AsyncAPI.MessageObject;
  operation: AsyncAPI.OperationObject;
} => {
  const { event, action } = options;
  const operationId = `${action}:${event}`;
  const encoded = encodeJsonPointerSegment(event);

  document.channels ||= {};
  document.operations ||= {};
  document.components ||= {};
  document.components.messages ||= {};

  const existingMessage = document.components.messages[event];
  const message: AsyncAPI.MessageObject =
    existingMessage && !isRef(existingMessage)
      ? existingMessage
      : (document.components.messages[event] = {
          name: event,
          contentType: 'application/json',
        });

  const existingChannel = document.channels[event];
  const channel: AsyncAPI.ChannelObject =
    existingChannel && !isRef(existingChannel)
      ? existingChannel
      : (document.channels[event] = {
          address: event,
          messages: {},
        });
  channel.messages ||= {};
  channel.messages[event] ||= {
    $ref: `#/components/messages/${encoded}`,
  };

  const existingOperation = document.operations[operationId];
  const operation: AsyncAPI.OperationObject =
    existingOperation && !isRef(existingOperation)
      ? existingOperation
      : (document.operations[operationId] = {
          action,
          channel: { $ref: `#/channels/${encoded}` },
          messages: [
            {
              $ref: `#/channels/${encoded}/messages/${encoded}`,
            },
          ],
        });

  return { channel, message, operation };
};
