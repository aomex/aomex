import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'अमान्य घटनाको नाम',
  invalid_room_name: 'अमान्य कोठाको नाम',
  unknown_event: 'अज्ञात घटना: {{event}}',
  handler_error: 'घटना प्रशोधन असफल भयो',
  duplicate_event: 'घटना पहिले नै दर्ता भइसकेको छ: {{event}}',
  already_attached: 'WebsocketApp पहिले नै attach भइसकेको छ, फेरि माउन्ट नगर्नुहोस्',
  transport_init_failed: 'WebSocket ट्रान्सपोर्ट सुरु गर्न सकिएन',
  handshake_failed: 'WebSocket ह्यान्डशेक असफल भयो',
  accept_failed: 'जडान स्वीकार गर्न सकिएन',
  fanout_deliver_failed: 'फ्यानआउटका क्रममा {{failed}} जडानमा लेख्न असफल भयो',
  inbound_task_failed: 'भित्रिने घटना प्रशोधन गर्न सकिएन',
  error_frame_failed: 'त्रुटि फ्रेम पठाउन सकिएन',
  remove_client_failed: 'जडान हटाउन सकिएन',
  close_connection_failed: 'जडान बन्द गर्न सकिएन',
  metric_handler_failed: 'मेट्रिक कलब्याक असफल भयो',
});
