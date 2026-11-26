import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  empty_brokers: 'brokers must not be empty',
  empty_broker: 'brokers contains an empty address',
  empty_client_id: 'clientId must not be empty',
  empty_group_id: 'groupId must not be empty',
  empty_topic: 'Topic name must not be empty',
  invalid_topic_name: 'Invalid topic name: {{topic}}',
  topic_name_too_long: 'Topic name is too long: {{length}} > {{max}}',
  duplicate_topic: 'Topic is registered more than once: {{topic}}',
  mixed_group_id: 'One consume call must use a single groupId',
  empty_consumers: 'No Kafka consumers were found',
  already_consuming: 'A consumer is already running',
  closed: 'Kafka connection is closed',
  message_too_large: 'Message exceeds the size limit: {{bytes}} > {{max}}',
  invalid_json: 'Message is not valid JSON',
  empty_message: 'Message payload is empty',
  encode_failed: 'Message could not be encoded as JSON',
  unknown_topic: 'Received an unsubscribed topic: {{topic}}',
  invalid_offset: 'Invalid message offset: {{offset}}',
  idempotent_requires_all_acks: 'acks must be -1 when the idempotent producer is enabled',
  unsupported_sasl: 'Unsupported SASL mechanism: {{mechanism}}',
  unsupported_tls: 'TLS option cannot be passed to the client: {{name}}',
  heartbeat_exceeds_session: 'Heartbeat interval must be less than the session timeout',
});
