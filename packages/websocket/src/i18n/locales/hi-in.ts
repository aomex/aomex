import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'अमान्य इवेंट नाम',
  invalid_room_name: 'अमान्य रूम नाम',
  unknown_event: 'अज्ञात इवेंट: {{event}}',
  handler_error: 'इवेंट प्रोसेसिंग विफल रही',
  duplicate_event: 'इवेंट पहले से पंजीकृत है: {{event}}',
  already_attached: 'WebsocketApp पहले से attach है, दोबारा माउंट न करें',
  transport_init_failed: 'WebSocket ट्रांसपोर्ट आरंभ नहीं हो सका',
  handshake_failed: 'WebSocket हैंडशेक विफल रहा',
  accept_failed: 'कनेक्शन स्वीकार नहीं हो सका',
  fanout_deliver_failed: 'फैनआउट के दौरान {{failed}} कनेक्शन पर लिखना विफल रहा',
  inbound_task_failed: 'इनबाउंड इवेंट संसाधित नहीं हो सका',
  error_frame_failed: 'त्रुटि फ़्रेम भेजा नहीं जा सका',
  remove_client_failed: 'कनेक्शन हटाया नहीं जा सका',
  close_connection_failed: 'कनेक्शन बंद नहीं हो सका',
  metric_handler_failed: 'मेट्रिक कॉलबैक विफल रहा',
});
