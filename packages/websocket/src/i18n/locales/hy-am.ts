import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hy-AM */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Անվավեր իրադարձության անուն',
  invalid_room_name: 'Անվավեր սենյակի անուն',
  unknown_event: 'Անհայտ իրադարձություն: {{event}}',
  handler_error: 'Իրադարձության մշակումը ձախողվեց',
  duplicate_event: 'Իրադարձությունն արդեն գրանցված է: {{event}}',
  already_attached: 'WebsocketApp-ն արդեն attach է, կրկին մի միացրեք',
  transport_init_failed: 'WebSocket փոխադրման սկզբնավորումը ձախողվեց',
  handshake_failed: 'WebSocket ձեռքսեղմումը ձախողվեց',
  accept_failed: 'Կապի ընդունումը ձախողվեց',
  fanout_deliver_failed: 'Տարածման ընթացքում {{failed}} կապի գրառումը ձախողվեց',
  inbound_task_failed: 'Մտնող իրադարձության մշակումը ձախողվեց',
  error_frame_failed: 'Սխալի շրջանակի ուղարկումը ձախողվեց',
  remove_client_failed: 'Կապի հեռացումը ձախողվեց',
  close_connection_failed: 'Կապի փակումը ձախողվեց',
  metric_handler_failed: 'Չափանիշների հետկանչը ձախողվեց',
});
