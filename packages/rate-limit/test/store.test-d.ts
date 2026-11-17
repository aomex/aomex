import { expectType, type TypeEqual } from 'ts-expect';
import { RateLimitStore, type RateLimitState } from '../src/store';

class DemoStore extends RateLimitStore {
  override async getAndSet(): Promise<RateLimitState> {
    return { key: 'k', remaining: 1, resetAt: 0 };
  }
}

const store = new DemoStore();
expectType<TypeEqual<() => Promise<void>, typeof store.onInit>>(true);
expectType<TypeEqual<() => Promise<void>, typeof store.onDestroy>>(true);

class OverrideStore extends RateLimitStore {
  override async onInit(): Promise<void> {}
  override async onDestroy(): Promise<void> {}
  override async getAndSet(): Promise<RateLimitState> {
    return { key: 'k', remaining: 0, resetAt: 0 };
  }
}

const overridden = new OverrideStore();
await overridden.onInit();
await overridden.onDestroy();

class BadStore extends RateLimitStore {
  // @ts-expect-error onInit 返回类型必须是 Promise<void>
  override onInit(): number {
    return 1;
  }
  override async getAndSet(): Promise<RateLimitState> {
    return { key: 'k', remaining: 0, resetAt: 0 };
  }
}

void new BadStore();
