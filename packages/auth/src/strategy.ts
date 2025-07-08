import { statuses, type OpenApiInjector, type WebContext } from '@aomex/web';
import type { AuthError } from './auth-error';

export abstract class Strategy<
  Payload extends object | string | number,
  AuthorizeArgs extends any[] = any[],
> {
  protected abstract authenticate(
    ctx: WebContext,
  ): Payload | false | AuthError | Promise<Payload | false | AuthError>;

  protected abstract authorize(
    payload: Payload,
    ...args: AuthorizeArgs
  ): boolean | AuthError | Promise<boolean | AuthError>;

  protected openapi(): OpenApiInjector {
    return {
      postMethod(methodItem) {
        methodItem.responses[401] ||= {
          description: statuses.message[401]!,
        };
      },
    };
  }
}
