import { type TypeEqual, expectType } from 'ts-expect';
import { WebResponse, type Body } from '../../src';
import { ServerResponse } from 'http';

let res!: WebResponse;

expectType<TypeEqual<Body, typeof res.body>>(true);
expectType<number>(res.contentLength);
expectType<string>(res.contentType);
expectType<void>(res.download(''));
expectType<boolean>(res.isJSON(''));
expectType<string | null>(res.matchContentType(''));
expectType<TypeEqual<ServerResponse, typeof res.res>>(true);
