import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hy-AM */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Օգտատիրոջ չարաշահման անհայտ պատճառ՝ {{reason}}',
  unknown_ip_abuse_reason: 'IP-ի չարաշահման անհայտ պատճառ՝ {{reason}}',
  duplicate_user_abuse_reason: 'Օգտատիրոջ չարաշահման կրկնվող պատճառ՝ {{reason}}',
  duplicate_ip_abuse_reason: 'IP-ի չարաշահման կրկնվող պատճառ՝ {{reason}}',
  missing_on_ban_user:
    'user-abuse ռազմավարություններ կարգավորելիս onBanUser-ը պարտադիր է',
  invalid_limit: 'limit-ը պետք է լինի դրական ամբողջ թիվ, ստացված՝ {{limit}}',
  invalid_window: 'window-ը պետք է լինի դրական տևողություն, ստացված՝ {{window}}',
  invalid_block_for: 'blockFor-ը պետք է լինի դրական տևողություն, ստացված՝ {{blockFor}}',
  invalid_ban_for: 'banFor-ը պետք է լինի դրական տևողություն, ստացված՝ {{banFor}}',
  empty_honeypot_paths: 'honeypot ռազմավարության paths-ը չի կարող դատարկ լինել',
  empty_http_error_status_codes:
    'http-error ռազմավարության statusCodes-ը չի կարող դատարկ լինել',
});
