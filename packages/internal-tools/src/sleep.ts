/**
 * 等待指定的时间（毫秒）后再往下执行
 */
export const sleep = (durationMS: number): Promise<void> =>
  durationMS <= 0
    ? Promise.resolve(void 0)
    : new Promise((resolve) => {
        setTimeout(resolve, durationMS);
      });
