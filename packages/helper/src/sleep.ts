export const sleep = (ms: number): Promise<void> =>
  ms <= 0
    ? Promise.resolve(void 0)
    : new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
