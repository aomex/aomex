import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers는 비어 있을 수 없습니다',
  empty_broker: 'brokers에 빈 주소가 있습니다',
  empty_client_id: 'clientId는 비어 있을 수 없습니다',
  empty_group_id: 'groupId는 비어 있을 수 없습니다',
  empty_topic: '주제 이름은 비어 있을 수 없습니다',
  invalid_topic_name: '잘못된 주제 이름: {{topic}}',
  topic_name_too_long: '주제 이름이 너무 깁니다: {{length}} > {{max}}',
  duplicate_topic: '주제가 중복 등록되었습니다: {{topic}}',
  mixed_group_id: '한 번의 소비에는 groupId가 하나만 허용됩니다',
  empty_consumers: 'Kafka 소비자를 찾을 수 없습니다',
  already_consuming: '이미 소비자가 실행 중입니다',
  closed: 'Kafka 연결이 닫혀 있습니다',
  message_too_large: '메시지 크기가 제한을 초과합니다: {{bytes}} > {{max}}',
  invalid_json: '메시지가 유효한 JSON이 아닙니다',
  empty_message: '메시지 본문이 비어 있습니다',
  encode_failed: '메시지를 JSON으로 인코딩할 수 없습니다',
  unknown_topic: '구독하지 않은 주제를 받았습니다: {{topic}}',
  invalid_offset: '잘못된 메시지 오프셋: {{offset}}',
  idempotent_requires_all_acks: '멱등 프로듀서를 켤 때 acks는 -1이어야 합니다',
  unsupported_sasl: '지원되지 않는 SASL 메커니즘: {{mechanism}}',
  unsupported_tls: 'TLS 옵션을 클라이언트에 전달할 수 없습니다: {{name}}',
  heartbeat_exceeds_session: '하트비트 간격은 세션 타임아웃보다 작아야 합니다',
});
