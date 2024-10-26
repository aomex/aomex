import { styleText } from 'node:util';
import symbols from 'log-symbols';
import ansi from 'ansi-escapes';
import type tableCJS from 'table';
import { createLogUpdate } from 'log-update';
import isUnicodeSupported from 'is-unicode-supported';
import stripAnsi from 'strip-ansi';
import { createRequire } from 'node:module';

const requireCJS = createRequire(import.meta.url);

/**
 * 终端输出实用函数
 */
class Terminal {
  /**
   * 打印文字，同`console.log`
   */
  print(...messages: any[]) {
    console.log(...messages);
  }

  /**
   * 打印蓝色通知信息，开头显示小图标 ℹ
   */
  printInfo(...messages: any[]) {
    console.info(
      symbols.info,
      ...messages.map((message) => this.style('blue', String(message))),
    );
  }

  /**
   * 打印黄色警告信息，开头显示小图标 ⚠
   */
  printWarning(...messages: any[]) {
    console.warn(
      symbols.warning,
      ...messages.map((message) => this.style('yellow', String(message))),
    );
  }

  /**
   * 打印红色错误信息，开头显示小图标 ✖️
   */
  printError(...messages: any[]) {
    console.error(
      symbols.error,
      ...messages.map((message) => this.style('red', String(message))),
    );
  }

  /**
   * 打印绿色成功信息，开头显示小图标 ✔
   */
  printSuccess(...messages: any[]) {
    console.log(
      symbols.success,
      ...messages.map((message) => this.style('green', String(message))),
    );
  }

  /**
   * 打印二维数组，呈现形式为表格
   * ```typescript
   * terminal.table([
   *   ['编号', '姓名', '性别'],
   *   [1, '张三', '男'],
   *   [2, '李四', '男'],
   *   [3, '翠花', '女'],
   * ]);
   * ```
   * @link https://www.npmjs.com/package/table
   */
  printTable(data: unknown[][], config?: tableCJS.TableUserConfig) {
    this.print(this.generateTable(data, config));
  }

  /**
   * 使用二维数组生成表格字符串
   * ```typescript
   * const table = terminal.generateTable([
   *   ['编号', '姓名', '性别'],
   *   [1, '张三', '男'],
   *   [2, '李四', '男'],
   *   [3, '翠花', '女'],
   * ]);
   * ```
   * @link https://www.npmjs.com/package/table
   */
  generateTable(data: unknown[][], config?: tableCJS.TableUserConfig): string {
    // CJS包，内容也多，直接import影响了node首次启动时间
    const { table } = requireCJS('table') as typeof tableCJS;
    return table(data, config).replace(/\n$/, '');
  }

  /**
   * 打印对象，自动展开深层级属性
   */
  printObject(obj: object) {
    console.dir(obj, { depth: null, colors: true });
  }

  /**
   * 清除终端屏幕文字，鼠标移到第一行开头
   */
  clearScreen() {
    process.stdout.write(ansi.clearScreen);
  }

  /**
   * 持续刷新终端文字。
   *
   * 文字可包含一些内置的占位符：
   * - `%loading%` 加载动画
   * - `%prepare%` 灰色准备小图标 ◼
   * - `%success%` 绿色成功小图标 ✔
   * - `%info%`    蓝色信息小图标 ℹ
   * - `%warning%` 黄色警告小图标 ⚠
   * - `%error%`   红色错误小图标 ✖️
   * - `%skip%`    灰色跳过小图标 ↓
   *
   * ```typescript
   * const session = terminal.applySession();
   *
   * session.update('%loading% 加载中\n  猜猜我是谁');
   * await sleep(1000);
   * session.update('%success% 成功\n  猜中了');
   * session.commit();
   * ```
   */
  applySession() {
    const supportUnicode = isUnicodeSupported();
    const logSession = createLogUpdate(process.stdout);
    const loadingFrames = supportUnicode
      ? ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
      : ['-', '\\', '|', '/'];
    const skipSymbol = this.style('gray', supportUnicode ? '↓' : '-');
    const prepareSymbol = this.style(['gray', 'dim'], supportUnicode ? '◼' : '.');
    let loadingFrameIndex = 0;
    let cacheText = '';
    let timer: NodeJS.Timeout | undefined;

    const replaceText = () => {
      return cacheText.replaceAll('%loading%', loadingFrames[loadingFrameIndex]!);
    };

    const reset = () => {
      clearInterval(timer);
      timer = undefined;
      loadingFrameIndex = 0;
    };

    let prevText = '';
    return {
      /**
       * 替换当前输出的文字
       */
      update: (text: string) => {
        if (prevText === text) return;
        prevText = text;
        cacheText = text
          .replaceAll('%success%', symbols.success)
          .replaceAll('%error%', symbols.error)
          .replaceAll('%warning%', symbols.warning)
          .replaceAll('%info%', symbols.info)
          .replaceAll('%skip%', skipSymbol)
          .replaceAll('%prepare%', prepareSymbol);

        logSession(replaceText());

        if (text.includes('%loading%')) {
          timer ||= setInterval(() => {
            loadingFrameIndex += 1;
            if (loadingFrameIndex === loadingFrames.length) {
              loadingFrameIndex = 0;
            }
            logSession(replaceText());
          }, 80);
        } else {
          reset();
        }
      },
      /**
       * 持久化已经输出的文字，进入下一个session
       */
      commit: () => {
        reset();
        logSession.done();
      },
    };
  }

  /**
   * 依次或批量执行任务列表
   * ```typescript
   * const { error, context } = await terminal.runTasks([
   *   {
   *     title: 'Task 1',
   *     task: async (ctx, task) => {}
   *   },
   *   {
   *     title: 'Task 2',
   *     task: async (ctx, task) => {}
   *   }
   * ]);
   * ```
   *
   * 默认是依次执行，若要批量执行则设置concurrent=true
   * ```typescript
   * await terminal.runTasks([], { concurrent: true });
   * ```
   */
  async runTasks<Context extends object = {}>(
    tasks: TaskItem<Context>[],
  ): Promise<{ error: Error | null; context: Context }>;
  async runTasks<Context extends object = {}>(
    tasks: TaskItem<Context>[],
    opts: { concurrent: false },
  ): Promise<{ error: Error | null; context: Context }>;
  async runTasks<Context extends object = {}>(
    tasks: TaskItem<Context>[],
    opts: { concurrent: true },
  ): Promise<{ errors: Error[] | null; context: Context }>;
  async runTasks<Context extends object = {}>(
    _tasks: TaskItem<Context>[],
    opts: { concurrent?: boolean } = {},
  ): Promise<
    { context: Context } & ({ error: Error | null } | { errors: Error[] | null })
  > {
    const { concurrent = false } = opts;
    const log = this.applySession();
    const tasks = _tasks.map((task) => {
      return { ...task, suffix: '', status: 'prepare' as TaskStatus };
    });

    const reRender = () => {
      log.update(
        tasks
          .map((task) => {
            const suffix =
              task.status === 'skip' ? this.style('gray', `[skipped]`) : task.suffix;
            return `%${task.status}% ${task.title}${suffix ? ' ' + suffix : ''}`;
          })
          .join('\n'),
      );
    };
    reRender();
    const timer = setInterval(reRender, 16);

    const handleTask = async (ctx: Context, task: (typeof tasks)[number]) => {
      const skipped: boolean =
        typeof task.skip === 'function' ? await task.skip(ctx) : task.skip === true;
      if (skipped) {
        task.status = 'skip';
        return { error: null };
      }
      try {
        task.status = 'loading';
        let statusChanged = false;
        await task.task(ctx, {
          get status() {
            return task.status;
          },
          set status(status) {
            task.status = status;
            statusChanged = true;
          },
          get title() {
            return task.title;
          },
          set title(t) {
            task.title = t;
          },
          get suffix() {
            return task.suffix;
          },
          set suffix(s) {
            task.suffix = s;
          },
        });
        if (!statusChanged) {
          task.status = 'success';
        }
      } catch (e) {
        task.status = 'error';
        task.suffix = this.style('red', (e as Error).message);
        return { error: e as Error };
      }

      return { error: null };
    };

    try {
      const ctx = {} as Context;
      if (concurrent) {
        const result = await Promise.allSettled(
          tasks.map((task) => handleTask(ctx, task)),
        );
        const errors: Error[] = [];
        for (const item of result) {
          if (item.status === 'fulfilled' && item.value.error !== null) {
            errors.push(item.value.error);
          }
        }
        if (errors.length) return { errors, context: ctx };
      } else {
        for (const task of tasks) {
          const { error } = await handleTask(ctx, task);
          if (error) return { error, context: ctx };
        }
      }
      return { context: ctx, error: null };
    } finally {
      clearInterval(timer);
      reRender();
      log.commit();
    }
  }

  /**
   * 为字符串设置样式：
   * - 文字颜色、背景色
   * - 粗体、斜体
   * - 下划线、删除线、上划线、双下划线
   *
   * ```typescript
   * const errorMsg = terminal.style('red', '一些错误的内容');
   * const warnMsg = terminal.style(['yellow', 'bold'], '严重警告文字');
   * ```
   */
  style(color: Parameters<typeof styleText>[0], string: string): string {
    return styleText(color, string);
  }

  /**
   * 去除ansi字符
   * ```typescript
   * terminal.stripStyle('\u001B[4mUnicorn\u001B[0m'); // Unicorn
   * ```
   */
  stripStyle(string: string) {
    return stripAnsi(string);
  }
}

type TaskStatus = 'success' | 'error' | 'skip' | 'warning' | 'loading';
interface TaskItem<Context> {
  title: string;
  skip?: boolean | ((ctx: Context) => boolean | Promise<boolean>);
  task: (
    ctx: Context,
    task: { title: string; suffix: string; status: TaskStatus },
  ) => Promise<any>;
}

export const terminal = new Terminal();
