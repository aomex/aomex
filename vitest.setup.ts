import { ensureRedisBinary } from './packages/cache-redis-adapter/test/helper/get-redis-binary';
import { ensureMongoBinary } from './packages/mongoose/test/helper/get-mongo-binary';

export default async function () {
  process.env.TZ = 'Asia/Shanghai';
  await Promise.all([ensureMongoBinary(), ensureRedisBinary()]);
}
