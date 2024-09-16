import timers from 'node:timers/promises';

/**
 * 等待指定的时间（毫秒）后再往下执行
 */
export const sleep = (durationMS: number): Promise<void> => {
  return durationMS <= 0 ? Promise.resolve(void 0) : timers.setTimeout(durationMS);
};
