import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（香港） */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers 不能為空',
  empty_broker: 'brokers 含有空地址',
  empty_client_id: 'clientId 不能為空',
  empty_group_id: 'groupId 不能為空',
  empty_topic: '主題名不能為空',
  invalid_topic_name: '非法的主題名：{{topic}}',
  topic_name_too_long: '主題名過長：{{length}} > {{max}}',
  duplicate_topic: '主題重複登記：{{topic}}',
  mixed_group_id: '同一次消費只能有一個 groupId',
  empty_consumers: '沒有找到 Kafka 消費者',
  already_consuming: '已有消費者在運行',
  closed: 'Kafka 連接已關閉',
  message_too_large: '訊息大小超過限制：{{bytes}} > {{max}}',
  invalid_json: '訊息不是合法的 JSON',
  empty_message: '訊息內容為空',
  encode_failed: '訊息無法編碼為 JSON',
  unknown_topic: '收到未訂閱的主題：{{topic}}',
  invalid_offset: '非法的訊息偏移量：{{offset}}',
  idempotent_requires_all_acks: '開啟冪等生產者時 acks 必須為 -1',
  unsupported_sasl: '不支援的 SASL 機制：{{mechanism}}',
  unsupported_tls: 'TLS 設定無法交給客戶端：{{name}}',
  heartbeat_exceeds_session: '心跳間隔必須小於會話逾時',
});
