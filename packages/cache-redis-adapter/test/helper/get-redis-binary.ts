import { RedisBinary } from 'redis-memory-server';

export const getRedisBinary = () => ({
  version: '7.4.2',
});

/** 预下载/命中缓存，避免 beforeAll 里首次拉二进制超时 */
export const ensureRedisBinary = async (): Promise<string> => {
  return RedisBinary.getPath(getRedisBinary());
};
