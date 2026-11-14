import { expectType, type TypeEqual } from 'ts-expect';
import {
  TelegramTransport,
  type TelegramTransportOptions,
  type TelegramDedupeOptions,
} from '../src';

{
  const opts: TelegramTransportOptions = {
    botToken: '1:a',
    chatId: 1,
  };
  void opts;
  const full: TelegramTransportOptions = {
    botToken: '1:a',
    chatId: 'x',
    timeout: 1000,
    format: (log) => log.message,
    dedupe: true,
  };
  void full;
  const withDedupe: TelegramTransportOptions = {
    botToken: '1:a',
    chatId: 1,
    dedupe: {
      interval: 3000,
      bindingKeys: 'all',
      fingerprint: (log) => log.message,
    },
  };
  void withDedupe;
  const withBindingKeys: TelegramTransportOptions = {
    botToken: '1:a',
    chatId: 1,
    dedupe: { bindingKeys: ['userId'] },
  };
  void withBindingKeys;
  const badBindingKeys: TelegramTransportOptions = {
    botToken: '1:a',
    chatId: 1,
    dedupe: {
      // @ts-expect-error bindingKeys 仅 'all' 或 string[]
      bindingKeys: true,
    },
  };
  void badBindingKeys;
  // @ts-expect-error
  const missingChat: TelegramTransportOptions = { botToken: '1:a' };
  void missingChat;
  // @ts-expect-error
  const badChat: TelegramTransportOptions = { botToken: '1:a', chatId: true };
  void badChat;
  const badDedupe: TelegramTransportOptions = {
    botToken: '1:a',
    chatId: 1,
    dedupe: {
      // @ts-expect-error interval 须为 number
      interval: 'x',
    },
  };
  void badDedupe;
  new TelegramTransport({
    botToken: '1:token',
    chatId: 1,
    // @ts-expect-error api 注入已移除
    api: {},
  });
  new TelegramTransport({
    botToken: '1:token',
    chatId: 1,
    // @ts-expect-error autoRetry 配置已移除
    autoRetry: false,
  });
}

{
  const t = new TelegramTransport({ botToken: '1:token', chatId: 1 });
  expectType<TypeEqual<TelegramTransport, typeof t>>(true);
  // @ts-expect-error
  t.api;
  // @ts-expect-error formatTelegramMessage 为 protected
  t.formatTelegramMessage;
  // @ts-expect-error fingerprintLog 为 protected
  t.fingerprintLog;
}

{
  const dedupe: TelegramDedupeOptions = { interval: 1 };
  void dedupe;
}
