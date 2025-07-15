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
   * 会自动触发的初始化方法。主进程会等待Promise结束才算初始化完成
   */
  protected async init(): Promise<void> {}

  /**
   * 实例销毁方法，调用函数`destroyServices`后触发
   */
  protected async destroy(): Promise<void> {}
}
