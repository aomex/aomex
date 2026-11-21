import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ga-IE */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Cúis mhí-úsáide úsáideora anaithnid: {{reason}}',
  unknown_ip_abuse_reason: 'Cúis mhí-úsáide IP anaithnid: {{reason}}',
  duplicate_user_abuse_reason: 'Cúis mhí-úsáide úsáideora dhúblach: {{reason}}',
  duplicate_ip_abuse_reason: 'Cúis mhí-úsáide IP dhúblach: {{reason}}',
  missing_on_ban_user:
    'Tá onBanUser riachtanach nuair a bhíonn straitéisí user-abuse cumraithe',
  invalid_limit: 'Ní mór do limit a bheith ina shlánuimhir dhearfach, faighte: {{limit}}',
  invalid_window: 'Ní mór do window a bheith ina fhad dearfach, faighte: {{window}}',
  invalid_block_for:
    'Ní mór do blockFor a bheith ina fhad dearfach, faighte: {{blockFor}}',
  invalid_ban_for: 'Ní mór do banFor a bheith ina fhad dearfach, faighte: {{banFor}}',
  empty_honeypot_paths: 'Ní féidir le paths na straitéise honeypot a bheith folamh',
  empty_http_error_status_codes:
    'Ní féidir le statusCodes na straitéise http-error a bheith folamh',
});
