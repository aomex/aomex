import { authentication } from '@aomex/auth';
import { bearerAdapter } from '../src';
import { expectType, type TypeEqual } from 'ts-expect';
import { WebMiddleware } from '@aomex/web';

// 泛型
{
  const jwt = bearerAdapter<{ userId: number }>({
    async onLoaded() {
      return false;
    },
  });
  const md = authentication(jwt);
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly auth: { userId: number };
      }>,
      typeof md
    >
  >(true);
}
