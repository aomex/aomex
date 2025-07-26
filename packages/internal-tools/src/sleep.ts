import timers from 'node:timers/promises';

// TimeoutOverflowWarning: 2147483648 does not fit into a 32-bit signed integer. Timeout duration was set to 1.
// setTimeout最大执行时间：2^31 - 1
const MAX_DURATION = 2147483647;

/**
 * 等待指定的时间（毫秒）后再往下执行
 */
export const sleep = async (durationMS: number): Promise<void> => {
  if (durationMS <= 0) return;
  if (durationMS <= MAX_DURATION) return timers.setTimeout(durationMS);
  do {
    await timers.setTimeout(durationMS > MAX_DURATION ? MAX_DURATION : durationMS);
    durationMS -= MAX_DURATION;
  } while (durationMS > 0);
};
