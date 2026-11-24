import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'अज्ञात प्रयोगकर्ता दुरुपयोग कारण: {{reason}}',
  unknown_ip_abuse_reason: 'अज्ञात IP दुरुपयोग कारण: {{reason}}',
  duplicate_user_abuse_reason: 'दोहोरिएको प्रयोगकर्ता दुरुपयोग कारण: {{reason}}',
  duplicate_ip_abuse_reason: 'दोहोरिएको IP दुरुपयोग कारण: {{reason}}',
  missing_on_ban_user: 'user-abuse रणनीतिहरू कन्फिगर गर्दा onBanUser आवश्यक छ',
  invalid_limit: 'limit धनात्मक पूर्णांक हुनुपर्छ, प्राप्त: {{limit}}',
  invalid_window: 'window धनात्मक अवधि हुनुपर्छ, प्राप्त: {{window}}',
  invalid_block_for: 'blockFor धनात्मक अवधि हुनुपर्छ, प्राप्त: {{blockFor}}',
  invalid_ban_for: 'banFor धनात्मक अवधि हुनुपर्छ, प्राप्त: {{banFor}}',
  empty_honeypot_paths: 'honeypot रणनीतिको paths खाली हुन सक्दैन',
  empty_http_error_status_codes: 'http-error रणनीतिको statusCodes खाली हुन सक्दैन',
  empty_socket_events: 'socket-events रणनीतिको events खाली हुन सक्दैन',
  blocked: 'पहुँच अस्वीकृत',
});
