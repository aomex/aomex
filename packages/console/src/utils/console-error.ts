export interface ConsoleErrorProperties {
  /** 业务/系统错误码，如 `COMMAND_NOT_FOUND` */
  code?: string;
  cause?: unknown;
}

/**
 * CLI 指令异常。`app.on('error')` 收到的均为本类实例。
 *
 * 业务侧用 `new ConsoleError` 创建；其它错误经 {@link ConsoleError.from} 转换。
 */
export class ConsoleError extends Error {
  code?: string;

  constructor(message?: string, properties?: ConsoleErrorProperties) {
    const { cause, code } = properties ?? {};
    super(message ?? 'Error', cause !== undefined ? { cause } : undefined);
    this.name = 'ConsoleError';
    if (code !== undefined) this.code = code;
    Error.captureStackTrace?.(this, new.target);
  }

  /** 是否为自制 {@link ConsoleError}（覆盖 `Error.isError`，类型收窄为本类） */
  static override isError(value: unknown): value is ConsoleError {
    return value instanceof ConsoleError;
  }

  /**
   * 将任意错误转为自制 {@link ConsoleError}。
   *
   * - 已是本类实例：原样返回
   * - `Error`：迁移 `message` / `cause` / `name` / `stack`，以及字符串 `code`（Node `ErrnoException`）
   * - 其余（含 plain object）：不猜测字段，落成默认实例或仅用字符串 message
   */
  static from(error: unknown): ConsoleError {
    if (ConsoleError.isError(error)) return error;

    if (error == null) {
      return new ConsoleError();
    }

    if (typeof error === 'string') {
      return new ConsoleError(error);
    }

    if (!Error.isError(error)) {
      return new ConsoleError();
    }

    const code = (error as Error & { code?: unknown }).code;
    const err = new ConsoleError(error.message || undefined, {
      code: typeof code === 'string' ? code : undefined,
      cause: error.cause,
    });
    if (error.name && error.name !== 'Error') {
      err.name = error.name;
    }
    if (error.stack) {
      err.stack = error.stack;
    }
    return err;
  }
}
