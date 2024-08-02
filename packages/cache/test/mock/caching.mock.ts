import { CacheAdapter } from '../../src';

export class MockStore extends CacheAdapter {
  override ttlKey(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  override leftPushValue(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  override rightPopValue(): Promise<string | null> {
    throw new Error('Method not implemented.');
  }
  override existsKey(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  override getValue(): Promise<string | null> {
    throw new Error('Method not implemented.');
  }
  override setValue(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  override setNotExistValue(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  override deleteValue(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  override deleteAllValues(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  override increaseValue(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  override decreaseValue(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  override expireKey(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
