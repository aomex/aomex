import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** el-GR */
export default I18n.satisfies(zh).define({
  empty_brokers: 'Το brokers δεν μπορεί να είναι κενό',
  empty_broker: 'Το brokers περιέχει κενή διεύθυνση',
  empty_client_id: 'Το clientId δεν μπορεί να είναι κενό',
  empty_group_id: 'Το groupId δεν μπορεί να είναι κενό',
  empty_topic: 'Το όνομα θέματος δεν μπορεί να είναι κενό',
  invalid_topic_name: 'Μη έγκυρο όνομα θέματος: {{topic}}',
  topic_name_too_long: 'Το όνομα θέματος είναι πολύ μεγάλο: {{length}} > {{max}}',
  duplicate_topic: 'Το θέμα έχει καταχωριστεί περισσότερες από μία φορές: {{topic}}',
  mixed_group_id: 'Μια κλήση consume μπορεί να έχει μόνο ένα groupId',
  empty_consumers: 'Δεν βρέθηκαν καταναλωτές Kafka',
  already_consuming: 'Ένας καταναλωτής εκτελείται ήδη',
  closed: 'Η σύνδεση Kafka είναι κλειστή',
  message_too_large: 'Το μέγεθος μηνύματος υπερβαίνει το όριο: {{bytes}} > {{max}}',
  invalid_json: 'Το μήνυμα δεν είναι έγκυρο JSON',
  empty_message: 'Το σώμα μηνύματος είναι κενό',
  encode_failed: 'Το μήνυμα δεν μπόρεσε να κωδικοποιηθεί ως JSON',
  unknown_topic: 'Λήφθηκε μη εγγεγραμμένο θέμα: {{topic}}',
  invalid_offset: 'Μη έγκυρη μετατόπιση μηνύματος: {{offset}}',
  idempotent_requires_all_acks:
    'Όταν είναι ενεργοποιημένος ο idempotent producer, το acks πρέπει να είναι -1',
  unsupported_sasl: 'Μη υποστηριζόμενος μηχανισμός SASL: {{mechanism}}',
  unsupported_tls: 'Η ρύθμιση TLS δεν μπορεί να περαστεί στον πελάτη: {{name}}',
  heartbeat_exceeds_session:
    'Το διάστημα καρδιακού παλμού πρέπει να είναι μικρότερο από το χρονικό όριο συνεδρίας',
});
