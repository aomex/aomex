import type { WebContext } from '@aomex/web';
import { Strategy } from '../../src';

export class MockStrategy<T extends object | string> extends Strategy<T> {
  protected override authorize(): boolean | Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  protected authenticate(_ctx: WebContext): Promise<T | false> {
    throw new Error('Method not implemented.');
  }
}
