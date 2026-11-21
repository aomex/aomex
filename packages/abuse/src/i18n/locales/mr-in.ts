import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mr-IN */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'अज्ञात वापरकर्ता गैरवापराचे कारण: {{reason}}',
  unknown_ip_abuse_reason: 'अज्ञात IP गैरवापराचे कारण: {{reason}}',
  duplicate_user_abuse_reason: 'डुप्लिकेट वापरकर्ता गैरवापराचे कारण: {{reason}}',
  duplicate_ip_abuse_reason: 'डुप्लिकेट IP गैरवापराचे कारण: {{reason}}',
  missing_on_ban_user: 'user-abuse धोरणे कॉन्फिगर केली असताना onBanUser आवश्यक आहे',
  invalid_limit: 'limit धन पूर्णांक असणे आवश्यक आहे, मिळाले: {{limit}}',
  invalid_window: 'window धन कालावधी असणे आवश्यक आहे, मिळाले: {{window}}',
  invalid_block_for: 'blockFor धन कालावधी असणे आवश्यक आहे, मिळाले: {{blockFor}}',
  invalid_ban_for: 'banFor धन कालावधी असणे आवश्यक आहे, मिळाले: {{banFor}}',
  empty_honeypot_paths: 'honeypot धोरणाचे paths रिकामे असू शकत नाही',
  empty_http_error_status_codes: 'http-error धोरणाचे statusCodes रिकामे असू शकत नाही',
});
