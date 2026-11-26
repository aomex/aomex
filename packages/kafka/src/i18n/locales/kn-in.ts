import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kn-IN */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers ಖಾಲಿ ಇರಬಾರದು',
  empty_broker: 'brokers ನಲ್ಲಿ ಖಾಲಿ ವಿಳಾಸವಿದೆ',
  empty_client_id: 'clientId ಖಾಲಿ ಇರಬಾರದು',
  empty_group_id: 'groupId ಖಾಲಿ ಇರಬಾರದು',
  empty_topic: 'ವಿಷಯದ ಹೆಸರು ಖಾಲಿ ಇರಬಾರದು',
  invalid_topic_name: 'ಅಮಾನ್ಯ ವಿಷಯ ಹೆಸರು: {{topic}}',
  topic_name_too_long: 'ವಿಷಯದ ಹೆಸರು ತುಂಬಾ ಉದ್ದವಾಗಿದೆ: {{length}} > {{max}}',
  duplicate_topic: 'ವಿಷಯವನ್ನು ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ಬಾರಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ: {{topic}}',
  mixed_group_id: 'ಒಂದು consume ಕರೆಯಲ್ಲಿ ಕೇವಲ ಒಂದು groupId ಇರಬಹುದು',
  empty_consumers: 'ಯಾವುದೇ Kafka ಗ್ರಾಹಕರು ಕಂಡುಬಂದಿಲ್ಲ',
  already_consuming: 'ಗ್ರಾಹಕ ಈಗಾಗಲೇ ಚಾಲನೆಯಲ್ಲಿದೆ',
  closed: 'Kafka ಸಂಪರ್ಕ ಮುಚ್ಚಲಾಗಿದೆ',
  message_too_large: 'ಸಂದೇಶದ ಗಾತ್ರವು ಮಿತಿಯನ್ನು ಮೀರಿದೆ: {{bytes}} > {{max}}',
  invalid_json: 'ಸಂದೇಶ ಮಾನ್ಯ JSON ಅಲ್ಲ',
  empty_message: 'ಸಂದೇಶದ ದೇಹ ಖಾಲಿಯಾಗಿದೆ',
  encode_failed: 'ಸಂದೇಶವನ್ನು JSON ಆಗಿ ಎನ್‌ಕೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ',
  unknown_topic: 'ಚಂದಾ ಮಾಡದ ವಿಷಯ ಸಿಕ್ಕಿದೆ: {{topic}}',
  invalid_offset: 'ಅಮಾನ್ಯ ಸಂದೇಶ ಆಫ್‌ಸೆಟ್: {{offset}}',
  idempotent_requires_all_acks: 'ಐಡೆಂಪೊಟೆಂಟ್ ಪ್ರೊಡ್ಯೂಸರ್ ಸಕ್ರಿಯವಾದಾಗ acks -1 ಆಗಿರಬೇಕು',
  unsupported_sasl: 'ಬೆಂಬಲವಿಲ್ಲದ SASL ಕಾರ್ಯವಿಧಾನ: {{mechanism}}',
  unsupported_tls: 'TLS ಆಯ್ಕೆಯನ್ನು ಕ್ಲೈಂಟ್‌ಗೆ ರವಾನಿಸಲಾಗುವುದಿಲ್ಲ: {{name}}',
  heartbeat_exceeds_session: 'ಹೃದಯ ಬಡಿತದ ಅಂತರವು ಸೆಷನ್ ಸಮಯ ಮೀರಿಕೆಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು',
});
