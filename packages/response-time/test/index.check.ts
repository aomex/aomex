import { WebMiddleware } from '@aomex/web';
import { expectType } from 'ts-expect';
import { responseTime } from '../src';

expectType<WebMiddleware>(responseTime);
