import { Caching } from '../../src';

export class MockCache extends Caching {
  protected override existsKey(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  protected override getValue(): Promise<string | null> {
    throw new Error('Method not implemented.');
  }
  protected override setValue(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  protected override addValue(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  protected override deleteValue(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  protected override deleteAllValues(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  protected override increaseValue(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  protected override decreaseValue(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  protected override expireValue(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
