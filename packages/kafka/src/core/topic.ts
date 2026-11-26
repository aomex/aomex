import type { Validator, ValidatorToken } from '@aomex/common';
import { i18n } from '../i18n';
import type { IsKafkaValue } from './types';

/** Kafka 主题名最大长度。 */
const TOPIC_NAME_MAX = 249;

/** 字母、数字、`.`、`_`、`-`。 */
const TOPIC_NAME_RE = /^[a-zA-Z0-9._-]+$/;

/**
 * 一份主题契约：名字和校验规则。生产和消费都引用它。
 * 请用 {@link defineKafkaTopic} 创建；构造函数为 `protected`，禁止业务侧直接 `new`。
 * 建议放在 `src/topics/`，文件名以 `.topic.ts` 结尾，变量名以 `Topic` 结尾，
 * 如 `order-created.topic.ts` 里的 `orderCreatedTopic`。
 */
export class KafkaTopic<T> {
  readonly name: string;
  readonly rule: ValidatorToken;
  /** 仅用于把消息体类型留在实例上。 */
  declare private readonly valueType: T;

  protected constructor(name: string, rule: ValidatorToken) {
    KafkaTopic.assertName(name);
    this.name = name;
    this.rule = rule;
  }

  /**
   * 供 {@link defineKafkaTopic} 调用；带「消息体须可 JSON 还原」的类型门禁。
   */
  protected static create<T extends ValidatorToken>(
    name: string,
    rule: IsKafkaValue<Validator.Infer<T>> extends true ? T : never,
  ): KafkaTopic<Validator.Infer<T>> {
    return new KafkaTopic(name, rule);
  }

  /**
   * 主题名须非空、不超过 249 字符，且只含字母、数字、`.`、`_`、`-`。
   * 不能是 `.` 或 `..`。
   */
  private static assertName(name: string): void {
    if (name.length === 0) {
      throw new Error(i18n.t('empty_topic'));
    }
    if (name.length > TOPIC_NAME_MAX) {
      throw new Error(
        i18n.t('topic_name_too_long', {
          length: String(name.length),
          max: String(TOPIC_NAME_MAX),
        }),
      );
    }
    if (name === '.' || name === '..' || !TOPIC_NAME_RE.test(name)) {
      throw new Error(i18n.t('invalid_topic_name', { topic: name }));
    }
  }
}

/**
 * 声明一个主题。建议每个主题一个文件，放在 `src/topics/`，文件名以 `.topic.ts` 结尾。
 *
 * ```ts
 * // src/topics/order-created.topic.ts
 * export const orderCreatedTopic = defineKafkaTopic('order.created', {
 *   orderId: rule.string(),
 *   amount: rule.number(),
 * });
 * ```
 */
export function defineKafkaTopic<T extends ValidatorToken>(
  name: string,
  rule: IsKafkaValue<Validator.Infer<T>> extends true ? T : never,
): KafkaTopic<Validator.Infer<T>> {
  return KafkaTopic['create'](name, rule);
}
