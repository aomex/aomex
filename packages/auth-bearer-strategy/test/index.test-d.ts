import { Authentication } from '@aomex/auth';
import { BearerStrategy } from '../src';
import { expectType, type TypeEqual } from 'ts-expect';
import { WebMiddleware } from '@aomex/web';

// 泛型
{
  const bearer = new BearerStrategy<{ userId: number }>({
    async onLoaded() {
      return false;
    },
  });
  const md = new Authentication({ strategies: { bearer } }).authenticate('bearer');
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly bearer: {
          readonly token: string;
          readonly data: {
            userId: number;
          };
        };
      }>,
      typeof md
    >
  >(true);
}
