import type { CombinedServices } from './combine-services';

export abstract class Service {
  protected get displayName() {
    const className = this.constructor.name;
    if (className.endsWith('Service')) {
      return className.slice(0, -7);
    }
    return className;
  }

  constructor(private readonly _services: Record<string, Service>) {}

  protected get services(): CombinedServices {
    return this._services as CombinedServices;
  }

  /**
   * 会自动触发的初始化方法
   */
  protected init(): void | Promise<void> {}
}
