import type { CombinedServices } from './combine-services';

export abstract class Service {
  constructor(private readonly _services: Record<string, Service>) {}

  protected get services(): CombinedServices {
    return this._services as CombinedServices;
  }

  /**
   * 会自动触发的初始化方法
   */
  protected init(): void | Promise<void> {}
}
