import type { Service } from './service';

/**
 * 销毁所有服务，执行每个服务中的方法`destroy()`
 */
export const destroyServices = async (services: Record<string, Service>) => {
  await Promise.all(
    Object.values(services).map((service) => {
      return service['destroy']();
    }),
  );
};
