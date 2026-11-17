import { RateLimitStore } from '@aomex/rate-limit';
import { RateLimitMemoryStore } from '@aomex/rate-limit/memory';
// @ts-expect-error 主入口不导出 MemoryStore
import { RateLimitMemoryStore as FromMain } from '@aomex/rate-limit';

const store: RateLimitStore = new RateLimitMemoryStore();
await store.onInit();
await store.onDestroy();
void FromMain;
