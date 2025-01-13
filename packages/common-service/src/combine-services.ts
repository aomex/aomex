import { Service } from './service';
/**
 * 为了让服务层有提示，你需要手动处理这一步：
 * 
 * ```typescript
    export const services = await combineServices({...});
    
    declare module '@aomex/common' {
      type T = typeof services;
      export interface CombinedServices extends T {}
    }
 * ```
 */
export interface CombinedServices {}

/**
 * 把所有服务绑定在一起，然后导出使用
 */
export const combineServices = async <
  T extends Record<string, new (services: Record<string, Service>) => Service>,
>(
  classes: T,
): Promise<{ readonly [K in keyof T]: InstanceType<T[K]> }> => {
  const services: Record<string, Service> = {};

  await Promise.all(
    Object.entries(classes)
      .map(([key, Class]) => {
        const service = new Class(services);
        services[key] = service;
        return service;
      })
      .map(async (instance) => {
        await instance['init']();
      }),
  );

  Object.freeze(services);

  return services as any;
};
