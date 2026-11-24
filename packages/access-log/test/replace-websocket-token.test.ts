import { expect, test, vitest } from 'vitest';
import { stripVTControlCharacters, styleText } from 'node:util';
import { replaceWebsocketToken } from '../src/replace-websocket-token';
import { WebsocketAccessLogToken } from '../src/websocket-token';

test('ip', async () => {
  const msg = await replaceWebsocketToken({
    message: WebsocketAccessLogToken.ip,
    startTime: process.hrtime(),
    ip: '::127.0.0.1',
    clientId: 'c1',
    event: 'ping',
  });
  expect(stripVTControlCharacters(msg)).toBe('::127.0.0.1');
});

test('空 ip 记为 -', async () => {
  const msg = await replaceWebsocketToken({
    message: WebsocketAccessLogToken.ip,
    startTime: process.hrtime(),
    ip: '',
    clientId: 'c1',
    event: 'ping',
  });
  expect(msg).toBe(styleText('gray', '-'));
  expect(stripVTControlCharacters(msg)).toBe('-');
});

test('clientId', async () => {
  const msg = await replaceWebsocketToken({
    message: WebsocketAccessLogToken.clientId,
    startTime: process.hrtime(),
    ip: '1.1.1.1',
    clientId: 'client-xyz',
    event: 'ping',
  });
  expect(stripVTControlCharacters(msg)).toBe('client-xyz');
});

test('event', async () => {
  const msg = await replaceWebsocketToken({
    message: WebsocketAccessLogToken.event,
    startTime: process.hrtime(),
    ip: '1.1.1.1',
    clientId: 'c1',
    event: 'chat.send',
  });
  expect(msg).toBe(styleText('bold', 'chat.send'));
  expect(stripVTControlCharacters(msg)).toBe('chat.send');
});

test('duration', async () => {
  const start = process.hrtime();
  const spy = vitest.spyOn(process, 'hrtime').mockImplementationOnce(() => [0, 10000]);

  const msg = await replaceWebsocketToken({
    message: WebsocketAccessLogToken.duration,
    startTime: start,
    ip: '1.1.1.1',
    clientId: 'c1',
    event: 'ping',
  });
  expect(stripVTControlCharacters(msg)).toBe('10μs');
  spy.mockRestore();
});

test('组合', async () => {
  const msg = await replaceWebsocketToken({
    message: `  ${WebsocketAccessLogToken.ip} ${WebsocketAccessLogToken.clientId} ${WebsocketAccessLogToken.event} ${WebsocketAccessLogToken.event} xx `,
    startTime: process.hrtime(),
    ip: '203.0.113.1',
    clientId: 'c9',
    event: 'hello',
  });
  expect(stripVTControlCharacters(msg)).toBe('  203.0.113.1 c9 hello hello xx ');
});

test('未知令牌保留原文', async () => {
  const msg = await replaceWebsocketToken({
    message: `${WebsocketAccessLogToken.event} [unknown]`,
    startTime: process.hrtime(),
    ip: '1.1.1.1',
    clientId: 'c9',
    event: 'hello',
  });
  expect(stripVTControlCharacters(msg)).toBe('hello [unknown]');
});

test('自定义令牌', async () => {
  const msg = await replaceWebsocketToken({
    message: `${WebsocketAccessLogToken.event} [room] [code] [custom]`,
    startTime: process.hrtime(),
    ip: '1.1.1.1',
    clientId: 'c1',
    event: 'join',
    tokens: {
      room: () => 'lobby',
      custom: async () => 'foo-bar',
    },
  });
  expect(stripVTControlCharacters(msg)).toBe('join lobby [code] foo-bar');
});

test('同名自定义令牌优先生效', async () => {
  // 自定义先把 `[event]` 替掉后，内置分支的 replaceAll 已匹配不到括号形式
  const msg = await replaceWebsocketToken({
    message: WebsocketAccessLogToken.event,
    startTime: process.hrtime(),
    ip: '1.1.1.1',
    clientId: 'c1',
    event: 'real-event',
    tokens: {
      event: () => 'custom-event',
    },
  });
  expect(stripVTControlCharacters(msg)).toBe('custom-event');
});

test('双括号', async () => {
  const msg = await replaceWebsocketToken({
    message: `[${WebsocketAccessLogToken.event}]`,
    startTime: process.hrtime(),
    ip: '1.1.1.1',
    clientId: 'c1',
    event: 'ping',
  });
  expect(stripVTControlCharacters(msg)).toBe('[ping]');
});
