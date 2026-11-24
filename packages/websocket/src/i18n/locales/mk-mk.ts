import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Неважечко име на настан',
  invalid_room_name: 'Неважечко име на соба',
  unknown_event: 'Непознат настан: {{event}}',
  handler_error: 'Обработката на настанот не успеа',
  duplicate_event: 'Настанот е веќе регистриран: {{event}}',
  already_attached: 'WebsocketApp е веќе attach, не го монтирајте повторно',
  transport_init_failed: 'Иницијализацијата на WebSocket транспортот не успеа',
  handshake_failed: 'WebSocket ракувањето не успеа',
  accept_failed: 'Прифаќањето на врската не успеа',
  fanout_deliver_failed: 'При распраќање записот кон {{failed}} врски не успеа',
  inbound_task_failed: 'Обработката на дојдовниот настан не успеа',
  error_frame_failed: 'Испраќањето на рамката за грешка не успеа',
  remove_client_failed: 'Отстранувањето на врската не успеа',
  close_connection_failed: 'Затворањето на врската не успеа',
  metric_handler_failed: 'Повратниот повик за метрики не успеа',
});
