import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers を空にはできません',
  empty_broker: 'brokers に空のアドレスが含まれています',
  empty_client_id: 'clientId を空にはできません',
  empty_group_id: 'groupId を空にはできません',
  empty_topic: 'トピック名を空にはできません',
  invalid_topic_name: '不正なトピック名：{{topic}}',
  topic_name_too_long: 'トピック名が長すぎます：{{length}} > {{max}}',
  duplicate_topic: 'トピックが重複登録されています：{{topic}}',
  mixed_group_id: '1 回の消費では groupId は 1 つだけにできます',
  empty_consumers: 'Kafka コンシューマーが見つかりません',
  already_consuming: 'すでにコンシューマーが実行中です',
  closed: 'Kafka 接続は閉じられています',
  message_too_large: 'メッセージサイズが制限を超えています：{{bytes}} > {{max}}',
  invalid_json: 'メッセージは有効な JSON ではありません',
  empty_message: 'メッセージ本文が空です',
  encode_failed: 'メッセージを JSON にエンコードできません',
  unknown_topic: '未購読のトピックを受信しました：{{topic}}',
  invalid_offset: '不正なメッセージオフセット：{{offset}}',
  idempotent_requires_all_acks:
    '冪等プロデューサーを有効にする場合、acks は -1 でなければなりません',
  unsupported_sasl: 'サポートされていない SASL メカニズム：{{mechanism}}',
  unsupported_tls: 'TLS 設定をクライアントに渡せません：{{name}}',
  heartbeat_exceeds_session:
    'ハートビート間隔はセッションタイムアウトより小さくなければなりません',
});
