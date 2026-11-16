import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, test } from 'vitest';
import sleep from 'sleep-promise';
import { CacheFileAdapter } from '../src/adapters/cache-file-adapter';

const require = createRequire(import.meta.url);
const tsxCli = require.resolve('tsx/cli');
const multiProcessHelper = fileURLToPath(
  new URL('./helper/file-adapter-multi-process-op.ts', import.meta.url),
);

const runMultiProcessOp = (filename: string, op: string, count: number) =>
  new Promise<unknown[]>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [tsxCli, multiProcessHelper, filename, op, String(count)],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`child exit ${code}: ${stderr || stdout}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout) as unknown[]);
      } catch (error) {
        reject(new Error(`invalid child output: ${stdout}\n${String(error)}`));
      }
    });
  });

const tempDirs: string[] = [];
const openStores: CacheFileAdapter[] = [];

/** Windows 上 SQLite 关闭后句柄释放可能略有延迟，删除目录需重试 */
const removeDirWithRetry = async (dir: string) => {
  for (let attempt = 0; ; attempt++) {
    try {
      rmSync(dir, { recursive: true, force: true });
      return;
    } catch (error) {
      if (attempt >= 20) throw error;
      await sleep(50);
    }
  }
};

afterEach(async () => {
  await Promise.all(openStores.splice(0).map((store) => store.disconnect()));
  while (tempDirs.length) {
    await removeDirWithRetry(tempDirs.pop()!);
  }
});

const createStore = (filename = ':memory:') => {
  const store = new CacheFileAdapter({ filename });
  if (filename !== ':memory:') openStores.push(store);
  return store;
};

const createFileStore = () => {
  const dir = mkdtempSync(join(tmpdir(), 'aomex-cache-file-'));
  tempDirs.push(dir);
  return createStore(join(dir, 'cache.sqlite'));
};

test('设置/获取', async () => {
  const store = createStore();
  const result = await store.setValue('foo', 'bar');
  expect(result).toBeTruthy();
  await expect(store.getValue('foo')).resolves.toBe('bar');
});

test('携带过期时间', async () => {
  const store = createStore();
  await store.setValue('foo', 'bar', 1000);
  await sleep(2000);
  await expect(store.getValue('foo')).resolves.toBeNull();
});

test('不存在才设置', async () => {
  const store = createStore();
  await expect(store.setNotExistValue('foo', 'bar')).resolves.toBeTruthy();
  await expect(store.setNotExistValue('foo', 'bar')).resolves.toBeFalsy();
  await expect(store.setNotExistValue('foo-1', 'bar', 1000)).resolves.toBeTruthy();
  await expect(store.setNotExistValue('foo-1', 'bar')).resolves.toBeFalsy();
  await sleep(2000);
  await expect(store.setNotExistValue('foo', 'bar')).resolves.toBeFalsy();
  await expect(store.setNotExistValue('foo-1', 'bar')).resolves.toBeTruthy();
});

test('判断存在', async () => {
  const store = createStore();
  await expect(store.existsKey('foo')).resolves.toBeFalsy();
  await store.setValue('foo', 'bar', 1000);
  await expect(store.existsKey('foo')).resolves.toBeTruthy();
  await sleep(2000);
  await expect(store.existsKey('foo')).resolves.toBeFalsy();
});

describe('自增', () => {
  test('默认设置0', async () => {
    const store = createStore();
    await expect(store.increaseValue('foo')).resolves.toBe(1);
    await expect(store.increaseValue('foo')).resolves.toBe(2);
  });

  test('设置初始值', async () => {
    const store = createStore();
    await store.setValue('foo', '30');
    await expect(store.increaseValue('foo')).resolves.toBe(31);
  });

  test('并发', async () => {
    const store = createStore();
    const result = await Promise.all([
      store.increaseValue('foo'),
      store.increaseValue('foo'),
      store.increaseValue('foo'),
      store.increaseValue('foo'),
      store.increaseValue('foo'),
      store.increaseValue('foo'),
      store.increaseValue('foo'),
    ]);
    expect(result.sort((a, b) => a - b)).toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('字符串无法自增', async () => {
    const store = createStore();
    await store.setValue('foo', '"30"');
    await expect(() => store.increaseValue('foo')).rejects.toThrow();
  });

  test('自增保留过期时间', async () => {
    const store = createStore();
    await store.setValue('foo', '1', 5000);
    await store.increaseValue('foo');
    await expect(store.ttlKey('foo')).resolves.toBeGreaterThan(3000);
  });
});

describe('自减', () => {
  test('默认设置0', async () => {
    const store = createStore();
    await expect(store.decreaseValue('foo')).resolves.toBe(-1);
    await expect(store.decreaseValue('foo')).resolves.toBe(-2);
  });

  test('设置初始值', async () => {
    const store = createStore();
    await store.setValue('foo', '30');
    await expect(store.decreaseValue('foo')).resolves.toBe(29);
  });

  test('并发', async () => {
    const store = createStore();
    const result = await Promise.all([
      store.decreaseValue('foo'),
      store.decreaseValue('foo'),
      store.decreaseValue('foo'),
      store.decreaseValue('foo'),
      store.decreaseValue('foo'),
      store.decreaseValue('foo'),
      store.decreaseValue('foo'),
    ]);
    expect(result.sort((a, b) => a - b)).toStrictEqual([-7, -6, -5, -4, -3, -2, -1]);
  });

  test('字符串无法自减', async () => {
    const store = createStore();
    await store.setValue('foo', '"30"');
    await expect(() => store.decreaseValue('foo')).rejects.toThrow();
  });
});

describe('过期时间', () => {
  test('当缓存存在，未设置过期时间，设置成功', async () => {
    const store = createStore();
    await store.setValue('foo', 'bar');
    await expect(store.expireKey('foo', 1000)).resolves.toBeTruthy();
    await expect(store.getValue('foo')).resolves.toBe('bar');
    await sleep(2000);
    await expect(store.getValue('foo')).resolves.toBeNull();
  });

  test('当缓存存在，已设置过期时间，设置成功', async () => {
    const store = createStore();
    await store.setValue('foo', 'bar', 5000);
    await expect(store.expireKey('foo', 1000)).resolves.toBeTruthy();
    await expect(store.getValue('foo')).resolves.toBe('bar');
    await sleep(2000);
    await expect(store.getValue('foo')).resolves.toBeNull();
  });

  test('当缓存不存在，设置失败', async () => {
    const store = createStore();
    await expect(store.expireKey('foo', 200)).resolves.toBeFalsy();
  });

  test('已过期的缓存设置失败', async () => {
    const store = createStore();
    await store.setValue('foo', 'bar', 500);
    await sleep(1000);
    await expect(store.expireKey('foo', 2000)).resolves.toBeFalsy();
  });
});

describe('查看剩余时间', () => {
  test('不存在的缓存', async () => {
    const store = createStore();
    await expect(store.ttlKey('foo')).resolves.toBe(-2);
  });

  test('过期的缓存', async () => {
    const store = createStore();
    await store.setValue('foo', 'bar', 500);
    await sleep(1000);
    await expect(store.ttlKey('foo')).resolves.toBe(-2);
  });

  test('未设置时间', async () => {
    const store = createStore();
    await store.setValue('foo', 'bar');
    await expect(store.ttlKey('foo')).resolves.toBe(-1);
  });

  test('已设置时间', async () => {
    const store = createStore();
    await store.setValue('foo', 'bar', 5000);
    await expect(store.ttlKey('foo')).resolves.toBeGreaterThan(4500);
  });
});

describe('数组操作', () => {
  test('左边推入，右边取出', async () => {
    const store = createStore();
    await store.leftPushValue('foo', 'bar', 'baz', 'test');
    await expect(store.rightPopValue('foo')).resolves.toBe('test');
    await expect(store.rightPopValue('foo')).resolves.toBe('baz');
    await expect(store.rightPopValue('foo')).resolves.toBe('bar');
    await expect(store.rightPopValue('foo')).resolves.toBe(null);
  });

  test('不能用get获取', async () => {
    const store = createStore();
    await store.leftPushValue('foo', 'bar');
    await expect(store.getValue('foo')).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: 值的类型不正确]`,
    );
  });

  test('可以使用exists判断', async () => {
    const store = createStore();
    await store.leftPushValue('foo', 'bar');
    await expect(store.existsKey('foo')).resolves.toBeTruthy();
  });

  test('不能自增', async () => {
    const store = createStore();
    await store.leftPushValue('foo', 'bar');
    await expect(store.increaseValue('foo')).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: 值的类型不正确]`,
    );
  });

  test('数组清空后可以自增', async () => {
    const store = createStore();
    await store.leftPushValue('foo', 'bar');
    await store.rightPopValue('foo');
    await expect(store.increaseValue('foo')).resolves.toBe(1);
  });

  test('字符串键不能当作数组', async () => {
    const store = createStore();
    await store.setValue('foo', 'bar');
    await expect(
      store.leftPushValue('foo', 'baz'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: 值的类型不正确]`);
    await expect(store.rightPopValue('foo')).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: 值的类型不正确]`,
    );
  });

  test('空数组弹出返回 null', async () => {
    const store = createStore();
    await expect(store.rightPopValue('missing')).resolves.toBeNull();
  });

  test('写入空列表后再弹出', async () => {
    const store = createStore();
    await store.leftPushValue('foo');
    await expect(store.rightPopValue('foo')).resolves.toBeNull();
    await expect(store.existsKey('foo')).resolves.toBeFalsy();
  });

  test('损坏的列表数据报错', async () => {
    const store = createStore();
    store['write']('foo', '[1]', 'list');
    await expect(store.rightPopValue('foo')).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: 值的类型不正确]`,
    );
    store['write']('bar', '"not-array"', 'list');
    await expect(
      store.leftPushValue('bar', 'x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: 值的类型不正确]`);
  });

  test('list 就地更新保留 TTL', async () => {
    const store = createStore();
    await store.leftPushValue('foo', 'a');
    await store.expireKey('foo', 5000);
    await store.leftPushValue('foo', 'b');
    await expect(store.ttlKey('foo')).resolves.toBeGreaterThan(3000);
  });
});

test('列表键存在时 NX 失败', async () => {
  const store = createStore();
  await store.leftPushValue('foo', 'bar');
  await expect(store.setNotExistValue('foo', 'baz')).resolves.toBeFalsy();
});

test('删除缓存', async () => {
  const store = createStore();
  await store.setValue('foo', '1');
  await store.setValue('bar', '2');
  await expect(store.deleteValue('foo')).resolves.toBeTruthy();
  await expect(store.getValue('foo')).resolves.toBeNull();
  await expect(store.getValue('bar')).resolves.toBe('2');
});

test('删除全部缓存', async () => {
  const store = createStore();
  await store.setValue('foo', '1');
  await store.setValue('bar', '2');
  await expect(store.deleteAllValues()).resolves.toBeTruthy();
  await expect(store.getValue('foo')).resolves.toBeNull();
  await expect(store.getValue('bar')).resolves.toBeNull();
});

test('文件库可持久化并自动创建目录', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'aomex-cache-file-'));
  tempDirs.push(dir);
  const filename = join(dir, 'nested', 'cache.sqlite');
  const store = createStore(filename);
  await store.setValue('foo', 'bar');
  await store.disconnect();

  const store2 = createStore(filename);
  await expect(store2.getValue('foo')).resolves.toBe('bar');
  await store2.disconnect();
});

test('disconnect 可重复调用，之后仍可继续读写', async () => {
  const store = createFileStore();
  await store.connect();
  await store.setValue('foo', 'bar');
  await store.disconnect();
  await expect(store.disconnect()).resolves.toBeUndefined();
  await expect(store.getValue('foo')).resolves.toBe('bar');
});

test('disconnect 在库已被关闭时仍安全', async () => {
  const store = createStore();
  await store.connect();
  store['db']!.close();
  await expect(store.disconnect()).resolves.toBeUndefined();
});

test('自定义 timeout 与绝对路径', () => {
  const dir = mkdtempSync(join(tmpdir(), 'aomex-cache-file-'));
  tempDirs.push(dir);
  const filename = join(dir, 'cache.sqlite');
  const store = new CacheFileAdapter({
    filename: join(dir, './cache.sqlite'),
    timeout: 1000,
  });
  openStores.push(store);
  expect(store.filename).toBe(filename);
  expect(store['timeout']).toBe(1000);
});

test('过期后 NX 可重新写入', async () => {
  const store = createStore();
  await store.setValue('foo', 'old', 500);
  await sleep(1000);
  await expect(store.setNotExistValue('foo', 'new')).resolves.toBeTruthy();
  await expect(store.getValue('foo')).resolves.toBe('new');
});

test('事务内嵌套读改写复用同一事务', () => {
  const store = createStore();
  store['withImmediateTransaction'](() => {
    expect(store['changeInteger']('foo', 1)).toBe(1);
    expect(store['changeInteger']('foo', 1)).toBe(2);
  });
});

test('事务失败会回滚', async () => {
  const store = createStore();
  await store.setValue('foo', 'bar');
  await expect(store.increaseValue('foo')).rejects.toThrow();
  await expect(store.getValue('foo')).resolves.toBe('bar');
});

describe('对齐 Redis', () => {
  test('SET 无 TTL 会清掉原过期时间', async () => {
    const store = createStore();
    await store.setValue('foo', 'bar', 5000);
    await store.setValue('foo', 'baz');
    await expect(store.ttlKey('foo')).resolves.toBe(-1);
    await expect(store.getValue('foo')).resolves.toBe('baz');
  });

  test('SET 可覆盖 list 为 string', async () => {
    const store = createStore();
    await store.leftPushValue('foo', 'a', 'b');
    await expect(store.setValue('foo', 'bar')).resolves.toBeTruthy();
    await expect(store.getValue('foo')).resolves.toBe('bar');
    await expect(store.rightPopValue('foo')).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: 值的类型不正确]`,
    );
  });

  test('SET NX 带 TTL，过期后可再次 NX', async () => {
    const store = createStore();
    await expect(store.setNotExistValue('foo', '1', 800)).resolves.toBeTruthy();
    await expect(store.setNotExistValue('foo', '2')).resolves.toBeFalsy();
    await sleep(1200);
    await expect(store.setNotExistValue('foo', '3')).resolves.toBeTruthy();
    await expect(store.getValue('foo')).resolves.toBe('3');
  });

  test('INCR 支持负数与前导零，拒绝小数/空串/正号', async () => {
    const store = createStore();
    await store.setValue('neg', '-2');
    await expect(store.increaseValue('neg')).resolves.toBe(-1);

    await store.setValue('zero', '030');
    await expect(store.increaseValue('zero')).resolves.toBe(31);
    await expect(store.getValue('zero')).resolves.toBe('31');

    await store.setValue('float', '1.5');
    await expect(store.increaseValue('float')).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: 值不是整数]`,
    );

    await store.setValue('empty', '');
    await expect(store.increaseValue('empty')).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: 值不是整数]`,
    );

    await store.setValue('plus', '+1');
    await expect(store.increaseValue('plus')).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: 值不是整数]`,
    );
  });

  test('INCR/DECR 在过期 key 上等同新建且无 TTL', async () => {
    const store = createStore();
    await store.setValue('foo', '9', 500);
    await sleep(1000);
    await expect(store.increaseValue('foo')).resolves.toBe(1);
    await expect(store.ttlKey('foo')).resolves.toBe(-1);

    await store.setValue('bar', '9', 500);
    await sleep(1000);
    await expect(store.decreaseValue('bar')).resolves.toBe(-1);
    await expect(store.ttlKey('bar')).resolves.toBe(-1);
  });

  test('DECR 保留 TTL', async () => {
    const store = createStore();
    await store.setValue('foo', '5', 5000);
    await expect(store.decreaseValue('foo')).resolves.toBe(4);
    await expect(store.ttlKey('foo')).resolves.toBeGreaterThan(3000);
  });

  test('EXPIRE/TTL 对 list 生效，弹出过程保留 TTL', async () => {
    const store = createStore();
    await store.leftPushValue('foo', 'a', 'b');
    await expect(store.expireKey('foo', 5000)).resolves.toBeTruthy();
    await expect(store.ttlKey('foo')).resolves.toBeGreaterThan(4000);
    await expect(store.rightPopValue('foo')).resolves.toBe('b');
    await expect(store.ttlKey('foo')).resolves.toBeGreaterThan(3000);
    await expect(store.existsKey('foo')).resolves.toBeTruthy();
  });

  test('GET 缺失返回 null；DELETE 缺失仍成功', async () => {
    const store = createStore();
    await expect(store.getValue('missing')).resolves.toBeNull();
    await expect(store.deleteValue('missing')).resolves.toBeTruthy();
  });

  test('EXISTS 对 string/list 均为 true，过期后为 false', async () => {
    const store = createStore();
    await store.setValue('s', '1', 800);
    await store.leftPushValue('l', 'x');
    await store.expireKey('l', 800);
    await expect(store.existsKey('s')).resolves.toBeTruthy();
    await expect(store.existsKey('l')).resolves.toBeTruthy();
    await sleep(1200);
    await expect(store.existsKey('s')).resolves.toBeFalsy();
    await expect(store.existsKey('l')).resolves.toBeFalsy();
  });

  test('多次 LPUSH 追加顺序与 Redis 适配器一致', async () => {
    const store = createStore();
    await store.leftPushValue('foo', '1');
    await store.leftPushValue('foo', '2', '3');
    await expect(store.rightPopValue('foo')).resolves.toBe('3');
    await expect(store.rightPopValue('foo')).resolves.toBe('2');
    await expect(store.rightPopValue('foo')).resolves.toBe('1');
  });

  test('deleteAll 清空后 INCR 从 1 重新开始', async () => {
    const store = createStore();
    await store.setValue('foo', '10');
    await store.deleteAllValues();
    await expect(store.increaseValue('foo')).resolves.toBe(1);
  });
});

describe('多进程原子性', () => {
  test('并发自增不丢计数', async () => {
    const store = createFileStore();
    const { filename } = store;
    await store.connect();
    await store.disconnect();

    const perProcess = 25;
    const processes = 4;
    const results = (
      await Promise.all(
        Array.from({ length: processes }, () =>
          runMultiProcessOp(filename, 'incr', perProcess),
        ),
      )
    ).flat() as number[];

    expect(results.sort((a, b) => a - b)).toStrictEqual(
      Array.from({ length: processes * perProcess }, (_, i) => i + 1),
    );

    const reader = createStore(filename);
    await expect(reader.getValue('counter')).resolves.toBe(
      String(processes * perProcess),
    );
    await reader.disconnect();
  }, 60_000);

  test('并发 NX 只有一个成功', async () => {
    const store = createFileStore();
    const { filename } = store;
    await store.connect();
    await store.disconnect();

    const results = (
      await Promise.all(
        Array.from({ length: 8 }, () => runMultiProcessOp(filename, 'nx', 1)),
      )
    ).flat() as boolean[];

    expect(results.filter(Boolean)).toHaveLength(1);
    expect(results.filter((item) => item === false)).toHaveLength(7);

    const reader = createStore(filename);
    await expect(reader.existsKey('nx-key')).resolves.toBeTruthy();
    await reader.disconnect();
  }, 60_000);

  test('并发 lpush 不丢元素', async () => {
    const store = createFileStore();
    const { filename } = store;
    await store.connect();
    await store.disconnect();

    const perProcess = 20;
    const processes = 3;
    await Promise.all(
      Array.from({ length: processes }, () =>
        runMultiProcessOp(filename, 'lpush', perProcess),
      ),
    );

    const reader = createStore(filename);
    const values: string[] = [];
    for (;;) {
      const item = await reader.rightPopValue('list');
      if (item === null) break;
      values.push(item);
    }
    expect(values).toHaveLength(processes * perProcess);
    await reader.disconnect();
  }, 60_000);
});
