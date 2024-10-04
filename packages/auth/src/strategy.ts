import { statuses, type OpenApiInjector, type WebContext } from '@aomex/web';

export abstract class Strategy<Payload extends object | string> {
  protected abstract authenticate(ctx: WebContext): Promise<Payload | false>;

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
