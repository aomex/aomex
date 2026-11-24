import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** el-GR */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Μη έγκυρο όνομα συμβάντος',
  invalid_room_name: 'Μη έγκυρο όνομα δωματίου',
  unknown_event: 'Άγνωστο συμβάν: {{event}}',
  handler_error: 'Η επεξεργασία του συμβάντος απέτυχε',
  duplicate_event: 'Το συμβάν είναι ήδη καταχωρισμένο: {{event}}',
  already_attached: 'Το WebsocketApp είναι ήδη attach, μην το προσαρτήσετε ξανά',
  transport_init_failed: 'Η αρχικοποίηση της μεταφοράς WebSocket απέτυχε',
  handshake_failed: 'Η χειραψία WebSocket απέτυχε',
  accept_failed: 'Η αποδοχή της σύνδεσης απέτυχε',
  fanout_deliver_failed: 'Κατά τη διανομή απέτυχαν {{failed}} εγγραφές σύνδεσης',
  inbound_task_failed: 'Η επεξεργασία του εισερχόμενου συμβάντος απέτυχε',
  error_frame_failed: 'Η αποστολή του πλαισίου σφάλματος απέτυχε',
  remove_client_failed: 'Η αφαίρεση της σύνδεσης απέτυχε',
  close_connection_failed: 'Το κλείσιμο της σύνδεσης απέτυχε',
  metric_handler_failed: 'Η επιστροφή μετρικών απέτυχε',
});
