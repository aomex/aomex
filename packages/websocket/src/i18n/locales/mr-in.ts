import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mr-IN */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'अवैध इव्हेंट नाव',
  invalid_room_name: 'अवैध रूम नाव',
  unknown_event: 'अज्ञात इव्हेंट: {{event}}',
  handler_error: 'इव्हेंट प्रक्रिया अयशस्वी',
  duplicate_event: 'इव्हेंट आधीच नोंदणीकृत आहे: {{event}}',
  already_attached: 'WebsocketApp आधीच attach आहे, पुन्हा माउंट करू नका',
  transport_init_failed: 'WebSocket वाहतूक सुरू करता आली नाही',
  handshake_failed: 'WebSocket हँडशेक अयशस्वी',
  accept_failed: 'कनेक्शन स्वीकारता आले नाही',
  fanout_deliver_failed: 'फॅनआउट दरम्यान {{failed}} कनेक्शनवर लिहिणे अयशस्वी',
  inbound_task_failed: 'इनबाउंड इव्हेंट हाताळता आला नाही',
  error_frame_failed: 'त्रुटी फ्रेम पाठवता आली नाही',
  remove_client_failed: 'कनेक्शन काढता आले नाही',
  close_connection_failed: 'कनेक्शन बंद करता आले नाही',
  metric_handler_failed: 'मेट्रिक कॉलबॅक अयशस्वी',
});
