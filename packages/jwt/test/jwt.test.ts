import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { jwt, JWTOptions } from '../src';
import { sign } from 'jsonwebtoken';
import {
  skip,
  WebApp,
  WebChain,
  WebContext,
  WebMiddlewareSkipOptions,
} from '@aomex/web';
import { chain, Middleware, middleware } from '@aomex/core';

const createApp = (
  options: JWTOptions & { debug?: boolean },
  callback?: (ctx: WebContext) => any,
  preChain?: WebChain,
  skipIfOptions?: WebMiddlewareSkipOptions,
) => {
  const app = new WebApp({ debug: options.debug });
  delete options.debug;
  preChain && app.mount(preChain);
  app.mount(skip(jwt(options), skipIfOptions || false));
  app.mount(
    middleware.web<Middleware.Infer<typeof jwt>>((ctx) => {
      ctx.send(ctx.jwt?.user ?? null);
      callback?.(ctx);
    }),
  );

  return app;
};

describe('failure tests', () => {
  test('should throw 401 if no authorization header', async () => {
    const app = createApp({ secret: 'shhhh' });

    await request(app.listen())
      .get('/')
      .expect(401)
      .expect('Authentication Error');
  });

  test('should throw 401 if no authorization header', async () => {
    const app = createApp({ secret: 'shhhh', debug: true });

    await request(app.listen()).get('/').expect(401).expect('Token not found');
  });

  test('should return 401 if authorization header is malformed', async () => {
    const app = createApp({ secret: 'shhhh' });

    await request(app.listen())
      .get('/')
      .set('Authorization', 'wrong')
      .expect(401)
      .expect(
        'Bad Authorization header format. Format is "Authorization: Bearer <token>"',
      );
  });

  test('should return 401 if authorization header does not start with Bearer', async () => {
    const app = createApp({ secret: 'shhhh' });

    await request(app.listen())
      .get('/')
      .set('Authorization', 'Bearskin Jacket')
      .expect(401)
      .expect(
        'Bad Authorization header format. Format is "Authorization: Bearer <token>"',
      );
  });

  test('should allow provided getToken function to throw', async () => {
    const app = createApp({
      secret: 'shhhh',
      getToken: (ctx) => ctx.throw(401, 'Bad Authorization'),
    });

    await request(app.listen())
      .get('/')
      .expect(401)
      .expect('Bad Authorization');
  });

  test('should throw if getToken function returns invalid jwt', async () => {
    const app = createApp({
      secret: 'shhhhhh',
      getToken: () => sign({ foo: 'bar' }, 'bad'),
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .expect(401)
      .expect('invalid signature');
  });

  test('should throw if authorization header is not well-formatted jwt', async () => {
    const app = createApp({
      secret: 'shhhhhh',
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', 'Bearer wrongjwt')
      .expect(401)
      .expect('jwt malformed');
  });

  test('should throw if authorization header is not valid jwt', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const app = createApp({
      secret: 'different-shhhh',
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('invalid signature');
  });

  test('should throw if authorization header is not valid jwt according to any secret', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);

    const app = createApp({
      secret: ['different-shhhh', 'some-other-shhhhh'],
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('invalid signature');
  });

  test('should throw non-descriptive errors when debug is false', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const app = createApp({
      secret: 'different-shhhh',
      debug: false,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('Authentication Error');
  });

  test('should throw if opts.cookies is set and the specified cookie is not well-formatted jwt', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const app = createApp({
      secret: secret,
      cookie: 'jwt',
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Cookie', `jwt=bad${token};`)
      .expect(401)
      .expect('invalid token');
  });

  test('should throw if audience is not expected', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar', aud: 'expected-audience' }, secret);

    const app = createApp({
      secret: 'shhhhhh',
      audience: 'not-expected-audience',
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('jwt audience invalid. expected: not-expected-audience');
  });

  test('should throw if token is expired', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar', exp: 1382412921 }, secret);
    const app = createApp({
      secret: 'shhhhhh',
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('jwt expired');
  });

  test('should throw with original jsonwebtoken error as originalError property', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar', exp: 1382412921 }, secret);
    const app = createApp(
      {
        secret: 'shhhhhh',
        debug: true,
      },
      undefined,
      chain.web.mount(
        middleware.web((_, next) => {
          return next().catch((err) => {
            expect(err).toHaveProperty('originalError');
            expect(err.originalError.message).toBe('jwt expired');
            throw err;
          });
        }),
      ),
    );

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('jwt expired');
  });

  test('should throw if token issuer is wrong', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar', iss: 'http://foo' }, secret);
    const app = createApp({
      secret: 'shhhhhh',
      issuer: 'http://wrong',
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('jwt issuer invalid. expected: http://wrong');
  });

  test('should throw if secret neither provided by options or middleware', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar', iss: 'http://foo' }, secret);
    // @ts-expect-error
    const app = createApp({
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('Secret not provided');
  });

  test('should throw if secret both provided by options (right secret) and middleware (wrong secret)', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar', iss: 'http://foo' }, secret);
    const app = createApp({
      secret: 'wrong secret',
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('invalid signature');
  });

  test('should throw 401 if isRevoked throw error', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const app = createApp({
      secret: secret,
      isRevoked: () =>
        Promise.reject(new Error('Token revocation check error')),
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('Token revocation check error');
  });

  test('should throw 401 if revoked token', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const app = createApp({
      secret: secret,
      isRevoked: () => Promise.resolve(true),
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('Token revoked');
  });

  test('should throw if secret provider rejects', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const app = createApp({
      secret: () => Promise.reject(new Error('Not supported')),
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('Not supported');
  });

  test('should throw if secret provider used but token invalid', async () => {
    const app = createApp({
      secret: () => Promise.resolve('a nice secret'),
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', 'Bearer dodgytoken')
      .expect(401)
      .expect('token invalid');
  });

  test('should throw if secret provider returns a secret that does not match jwt', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const app = createApp({
      secret: () => Promise.resolve('not my secret'),
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('invalid signature');
  });

  test('should throw if no secret provider returns a secret that matches jwt', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const app = createApp({
      secret: () => Promise.resolve(['not my secret', 'still not my secret']),
      debug: true,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('invalid signature');
  });
});

describe('success tests', () => {
  test('should work if authorization header is valid jwt', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const app = createApp({
      secret,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => res.body.foo !== 'bar' && 'Wrong user');
  });

  test('should work if authorization header contains leading and/or trailing whitespace', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);

    const app = createApp({
      secret,
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `     Bearer ${token}     `)
      .expect(200)
      .expect((res) => res.body.foo !== 'bar' && 'Wrong user');
  });

  test('should work if authorization header is valid jwt according to one of the secrets', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const app = createApp({
      secret: [secret, 'another secret'],
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => res.body.foo !== 'bar' && 'Wrong user');
  });

  test('should work if the provided getToken function returns a valid jwt', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);

    const app = createApp({
      secret: secret,
      getToken: (ctx) => ctx.request.query['token'] as string,
    });

    await request(app.listen())
      .get(`/?token=${token}`)
      .expect(200)
      .expect((res) => res.body.foo !== 'bar' && 'Wrong user');
  });

  test('should use the first resolved token', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const invalidToken = sign({ foo: 'bar' }, 'badSecret');
    const app = createApp({
      secret: secret,
      cookie: 'jwt',
    });

    await request(app.listen())
      .get('/')
      .set('Cookie', `jwt=${token};`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(200)
      .expect((res) => res.body.foo !== 'bar' && 'Wrong user');
  });

  test('should work if opts.cookies is set and the specified cookie contains valid jwt', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);

    const app = createApp({
      secret: secret,
      cookie: 'jwt',
    });

    await request(app.listen())
      .get('/')
      .set('Cookie', `jwt=${token};`)
      .expect(200)
      .expect((res) => res.body.foo !== 'bar' && 'Wrong user');
  });

  test('should work if secret is provided by secret provider function', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const app = createApp({
      secret: () => Promise.resolve(secret),
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => res.body.foo !== 'bar' && 'Wrong user');
  });

  test('should work if a valid secret is provided by one of the secret provider functions', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const app = createApp({
      secret: () => Promise.resolve(['other-shhhh', secret]),
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => res.body.foo !== 'bar' && 'Wrong user');
  });
});

describe('skipIf tests', () => {
  test('should pass if the route is excluded', async () => {
    const secret = 'shhhhhh';
    const app = createApp(
      { secret },
      (ctx) => {
        ctx.send({ success: true });
      },
      undefined,
      { path: ['/public'] },
    );

    await request(app.listen())
      .get('/public')
      .set('Authorization', 'wrong')
      .expect(200)
      .expect(
        (res) => res.body.success === true && 'aomex-jwt is getting fired.',
      );
  });

  test('should fail if the route is not excluded', async () => {
    const secret = 'shhhhhh';
    const app = createApp(
      { secret },
      (ctx) => {
        ctx.send({ success: true });
      },
      undefined,
      { path: ['/public'] },
    );

    await request(app.listen())
      .get('/private')
      .set('Authorization', 'wrong')
      .expect(401)
      .expect(
        'Bad Authorization header format. Format is "Authorization: Bearer <token>"',
      );
  });

  test('should work if authorization header is valid jwt and is not revoked', async () => {
    const secret = 'shhhhhh';
    const token = sign({ foo: 'bar' }, secret);
    const app = createApp({
      secret: secret,
      isRevoked: () => Promise.resolve(false),
    });

    await request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        return res.body.foo !== 'bar' && 'Wrong user';
      });
  });
});
