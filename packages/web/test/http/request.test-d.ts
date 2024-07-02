import { type TypeEqual, expectType } from 'ts-expect';
import type { WebRequest } from '../../src';
import type { Accepts } from 'accepts';

let request!: WebRequest;

expectType<string>(request.method);
expectType<string>(request.url);

expectType<Accepts>(request.accept);
expectType<
  TypeEqual<{ readonly [key: string]: string | undefined }, typeof request.cookies>
>(true);
expectType<TypeEqual<Record<string, unknown>, typeof request.body>>(true);
expectType<boolean>(request.fresh);
expectType<string>(request.host);
expectType<string>(request.href);
expectType<string>(request.ip);
expectType<string>(request.origin);
expectType<string>(request.pathname);
expectType<string>(request.protocol);
expectType<TypeEqual<Record<string, unknown>, typeof request.query>>(true);
expectType<string>(request.querystring);
expectType<string>(request.search);
expectType<boolean>(request.secure);
expectType<string | null>(request.matchContentType(''));
