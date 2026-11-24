import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  invalid_event_name: 'Invalid event name',
  invalid_room_name: 'Invalid room name',
  unknown_event: 'Unknown event: {{event}}',
  handler_error: 'Event handler failed',
  duplicate_event: 'Event already registered: {{event}}',
  already_attached: 'WebsocketApp is already attached',
  transport_init_failed: 'WebSocket transport failed to initialize',
  handshake_failed: 'WebSocket handshake failed',
  accept_failed: 'Failed to accept the connection',
  fanout_deliver_failed: '{{failed}} connection writes failed during fanout',
  inbound_task_failed: 'Inbound event handling failed',
  error_frame_failed: 'Failed to send the error frame',
  remove_client_failed: 'Failed to remove the connection',
  close_connection_failed: 'Failed to close the connection',
  metric_handler_failed: 'Metric handler failed',
});
