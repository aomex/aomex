export abstract class Service {
  protected get displayName() {
    const className = this.constructor.name;
    if (className.endsWith('Service')) {
      return className.slice(0, -7);
    }
    return className;
  }

  /**
   * 懒加载后、首次对外调用前自动触发。同一次 combine 内对单个服务只执行一次。
   *
   * 请保持 `protected`；即便误写成 public，也不会出现在 `services.xxx` 的类型上。
   */
  protected async onInit(): Promise<void> {}

  /**
   * 进程/应用关停时由 WebApp、ConsoleApp 自动触发。
   *
   * 请保持 `protected`；即便误写成 public，也不会出现在 `services.xxx` 的类型上。
   */
  protected async onDestroy(): Promise<void> {}
}
