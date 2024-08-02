import type { WebContext } from '@aomex/web';
import { AuthenticationAdapter } from '../../src';

export class MockAdapter<T extends object | string> extends AuthenticationAdapter<T> {
  protected authenticate(_ctx: WebContext): Promise<T | false> {
    throw new Error('Method not implemented.');
  }
}
