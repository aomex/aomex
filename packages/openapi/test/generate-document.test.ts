import { tmpdir } from 'node:os';
import path from 'node:path';
import EventEmitter from 'node:events';
import { access, readFile, rm } from 'node:fs/promises';
import yaml from 'yaml';
import stripAnsi from 'strip-ansi';
import pkg from '../package.json';
import { generateDocument } from '../src';

describe('default props', () => {
  test('default set document version', async () => {
    const { document } = await generateDocument({
      emitter: new EventEmitter(),
      routers: [],
    });
    expect(document.openapi).toBe('3.0.3');
  });

  test('default set info.title', async () => {
    const { document } = await generateDocument({
      emitter: new EventEmitter(),
      routers: [],
    });
    expect(document.info.title).toBe(pkg.name);
  });

  test('default set info.version', async () => {
    const { document } = await generateDocument({
      emitter: new EventEmitter(),
      routers: [],
    });
    expect(document.info.version).toBe(pkg.version);
  });
});

test('no errors for default docs', async () => {
  const { result } = await generateDocument({
    emitter: new EventEmitter(),
    routers: [],
  });
  expect(result.errors).toHaveLength(0);
});

describe('routers', () => {
  test('parse routers', async () => {
    const { document } = await generateDocument({
      emitter: new EventEmitter(),
      routers: ['./test/routers'],
    });
    expect(document.paths).toMatchSnapshot();
  });

  test('format path placeholder', async () => {
    const { document } = await generateDocument({
      emitter: new EventEmitter(),
      routers: ['./test/routers'],
    });
    expect(document.paths).toHaveProperty('/abc/{id}');
  });

  test('collect tags to definition', async () => {
    const { document } = await generateDocument({
      emitter: new EventEmitter(),
      routers: ['./test/routers'],
    });
    expect(
      document.tags?.findIndex((item) => item.name === 'test1'),
    ).toBeGreaterThan(-1);
  });

  test('unused tags will not be removed', async () => {
    const { document } = await generateDocument({
      emitter: new EventEmitter(),
      routers: ['./test/routers'],
      docs: {
        tags: [
          {
            name: 'aabb',
          },
        ],
      },
    });
    expect(document.tags!.findIndex((item) => item.name === 'aabb')).toBe(0);
    expect(
      document.tags!.findIndex((item) => item.name === 'test1'),
    ).toBeGreaterThan(-1);
  });
});

describe('output', () => {
  test('save docs to json file', async () => {
    const file = path.join(tmpdir(), Math.random() + '.json');
    try {
      await rm(file);
    } catch {}

    const { document } = await generateDocument({
      emitter: new EventEmitter(),
      routers: [],
      output: file,
    });

    await expect(access(file)).to.resolves.toBeUndefined();
    await expect(readFile(file, 'utf8')).resolves.toBe(
      JSON.stringify(document),
    );
  });

  test('save docs to yaml file', async () => {
    const file = path.join(tmpdir(), Math.random() + '.yml');
    try {
      await rm(file);
    } catch {}

    const { document } = await generateDocument({
      emitter: new EventEmitter(),
      routers: [],
      output: file,
    });

    await expect(access(file)).to.resolves.toBeUndefined();
    await expect(readFile(file, 'utf8')).resolves.toBe(
      yaml.stringify(document),
    );
  });

  test('default save to file ./openapi.json', async () => {
    const file = path.resolve('openapi.json');
    try {
      await rm(file);
    } catch {}

    await generateDocument({ emitter: new EventEmitter(), routers: [] });
    await expect(access(file)).to.resolves.toBeUndefined();
  });

  test('stop saving to ./openapi.json', async () => {
    const file = path.resolve('openapi.json');
    try {
      await rm(file);
    } catch {}

    await generateDocument({
      emitter: new EventEmitter(),
      routers: [],
      output: false,
    });
    await expect(access(file)).to.rejects.toThrowError();
  });
});

test('pretty json file', async () => {
  const file = path.join(tmpdir(), Math.random() + '.json');

  const { document } = await generateDocument({
    emitter: new EventEmitter(),
    routers: [],
    output: file,
    prettyJson: true,
  });

  await expect(readFile(file, 'utf8')).resolves.toBe(
    JSON.stringify(document, null, 2),
  );
});

test('fix docs', async () => {
  const { document } = await generateDocument({
    emitter: new EventEmitter(),
    routers: [],
    docs: {
      openapi: '3.0.0',
    },
    fix: (data) => {
      data.openapi = '3.0.2';
    },
  });

  expect(document.openapi).toBe('3.0.2');
});

test('fix docs and return new docs', async () => {
  const { document } = await generateDocument({
    emitter: new EventEmitter(),
    routers: [],
    docs: {
      openapi: '3.0.0',
    },
    fix: (data) => {
      data.openapi = '3.0.2';
    },
  });

  expect(document.openapi).toBe('3.0.2');
});

describe('emitter', () => {
  const emitter = new EventEmitter();
  const msgs: string[] = [];

  ['start', 'msg', 'replace', 'end'].forEach((eventName) => {
    emitter.on(eventName, (...args: any[]) => {
      msgs.push(
        ...args.filter((item) => typeof item === 'string').map(stripAnsi),
      );
    });
  });

  beforeEach(() => {
    msgs.length = 0;
  });

  test('emit events', async () => {
    await generateDocument({
      routers: ['./test/routers'],
      emitter: emitter,
    });
    expect(msgs).toMatchSnapshot();
  });

  test('validate with errors', async () => {
    await generateDocument({
      docs: {
        // @ts-expect-error
        openapi: '3',
      },
      routers: [],
      emitter: emitter,
    });
    expect(msgs).toMatchSnapshot();
  });
});
