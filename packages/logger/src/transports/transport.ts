import type { Logger } from '../logger';

export abstract class Transport {
  abstract consume(log: Logger.Log): Promise<any>;

  /**
   * 解析日期。返回 年、月、日、时、分、秒
   */
  protected dateToJSON(date: Date) {
    return {
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      day: date.getDate().toString().padStart(2, '0'),
      hour: date.getHours().toString().padStart(2, '0'),
      minute: date.getMinutes().toString().padStart(2, '0'),
      second: date.getSeconds().toString().padStart(2, '0'),
    };
  }

  /**
   * 时间字符串：`年-月-日 时:分:秒`
   */
  protected dateToString(date: Date) {
    const parsed = this.dateToJSON(date);
    return `${parsed.year}-${parsed.month}-${parsed.day} ${parsed.hour}:${parsed.minute}:${parsed.second}`;
  }
}
