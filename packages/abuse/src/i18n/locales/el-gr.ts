import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** el-GR */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Άγνωστη αιτία κατάχρησης χρήστη: {{reason}}',
  unknown_ip_abuse_reason: 'Άγνωστη αιτία κατάχρησης IP: {{reason}}',
  duplicate_user_abuse_reason: 'Διπλότυπη αιτία κατάχρησης χρήστη: {{reason}}',
  duplicate_ip_abuse_reason: 'Διπλότυπη αιτία κατάχρησης IP: {{reason}}',
  missing_on_ban_user:
    'Το onBanUser είναι υποχρεωτικό όταν έχουν ρυθμιστεί στρατηγικές user-abuse',
  invalid_limit: 'Το limit πρέπει να είναι θετικός ακέραιος, λήφθηκε: {{limit}}',
  invalid_window: 'Το window πρέπει να είναι θετική διάρκεια, λήφθηκε: {{window}}',
  invalid_block_for: 'Το blockFor πρέπει να είναι θετική διάρκεια, λήφθηκε: {{blockFor}}',
  invalid_ban_for: 'Το banFor πρέπει να είναι θετική διάρκεια, λήφθηκε: {{banFor}}',
  empty_honeypot_paths: 'Το paths της στρατηγικής honeypot δεν μπορεί να είναι κενό',
  empty_http_error_status_codes:
    'Το statusCodes της στρατηγικής http-error δεν μπορεί να είναι κενό',
});
