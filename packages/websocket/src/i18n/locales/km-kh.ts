import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** km-KH */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'ឈ្មោះព្រឹត្តិការណ៍មិនត្រឹមត្រូវ',
  invalid_room_name: 'ឈ្មោះបន្ទប់មិនត្រឹមត្រូវ',
  unknown_event: 'ព្រឹត្តិការណ៍មិនស្គាល់៖ {{event}}',
  handler_error: 'ការដំណើរការព្រឹត្តិការណ៍បានបរាជ័យ',
  duplicate_event: 'ព្រឹត្តិការណ៍បានចុះឈ្មោះរួចហើយ៖ {{event}}',
  already_attached: 'WebsocketApp បាន attach រួចហើយ សូមកុំភ្ជាប់ម្ដងទៀត',
  transport_init_failed: 'បរាជ័យក្នុងការចាប់ផ្តើមការដឹកជញ្ជូន WebSocket',
  handshake_failed: 'ការចាប់ដៃ WebSocket បានបរាជ័យ',
  accept_failed: 'បរាជ័យក្នុងការទទួលការតភ្ជាប់',
  fanout_deliver_failed: 'ការសរសេរទៅការតភ្ជាប់ {{failed}} បានបរាជ័យអំឡុងពេលចែកចាយ',
  inbound_task_failed: 'បរាជ័យក្នុងដំណើរការព្រឹត្តិការណ៍ចូល',
  error_frame_failed: 'បរាជ័យក្នុងការផ្ញើស៊ុមកំហុស',
  remove_client_failed: 'បរាជ័យក្នុងការដកការតភ្ជាប់',
  close_connection_failed: 'បរាជ័យក្នុងការបិទការតភ្ជាប់',
  metric_handler_failed: 'ការហៅត្រឡប់ម៉ែត្របានបរាជ័យ',
});
