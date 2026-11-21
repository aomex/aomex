import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kn-IN */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'ಅಪರಿಚಿತ ಬಳಕೆದಾರ ದುರುಪಯೋಗ ಕಾರಣ: {{reason}}',
  unknown_ip_abuse_reason: 'ಅಪರಿಚಿತ IP ದುರುಪಯೋಗ ಕಾರಣ: {{reason}}',
  duplicate_user_abuse_reason: 'ನಕಲಿ ಬಳಕೆದಾರ ದುರುಪಯೋಗ ಕಾರಣ: {{reason}}',
  duplicate_ip_abuse_reason: 'ನಕಲಿ IP ದುರುಪಯೋಗ ಕಾರಣ: {{reason}}',
  missing_on_ban_user: 'user-abuse ತಂತ್ರಗಳನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿದಾಗ onBanUser ಅಗತ್ಯ',
  invalid_limit: 'limit ಧನಾತ್ಮಕ ಪೂರ್ಣಾಂಕವಾಗಿರಬೇಕು, ಸ್ವೀಕರಿಸಿದ್ದು: {{limit}}',
  invalid_window: 'window ಧನಾತ್ಮಕ ಅವಧಿಯಾಗಿರಬೇಕು, ಸ್ವೀಕರಿಸಿದ್ದು: {{window}}',
  invalid_block_for: 'blockFor ಧನಾತ್ಮಕ ಅವಧಿಯಾಗಿರಬೇಕು, ಸ್ವೀಕರಿಸಿದ್ದು: {{blockFor}}',
  invalid_ban_for: 'banFor ಧನಾತ್ಮಕ ಅವಧಿಯಾಗಿರಬೇಕು, ಸ್ವೀಕರಿಸಿದ್ದು: {{banFor}}',
  empty_honeypot_paths: 'honeypot ತಂತ್ರದ paths ಖಾಲಿಯಾಗಿರಬಾರದು',
  empty_http_error_status_codes: 'http-error ತಂತ್ರದ statusCodes ಖಾಲಿಯಾಗಿರಬಾರದು',
});
