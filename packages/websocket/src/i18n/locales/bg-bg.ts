import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Невалидно име на събитие',
  invalid_room_name: 'Невалидно име на стая',
  unknown_event: 'Неизвестно събитие: {{event}}',
  handler_error: 'Обработката на събитието не успя',
  duplicate_event: 'Събитието вече е регистрирано: {{event}}',
  already_attached: 'WebsocketApp вече е attach, не го монтирайте отново',
  transport_init_failed: 'Инициализацията на WebSocket транспорта не успя',
  handshake_failed: 'WebSocket ръкостискането не успя',
  accept_failed: 'Приемането на връзката не успя',
  fanout_deliver_failed: 'При разпращане записът към {{failed}} връзки не успя',
  inbound_task_failed: 'Обработката на входящото събитие не успя',
  error_frame_failed: 'Изпращането на кадъра за грешка не успя',
  remove_client_failed: 'Премахването на връзката не успя',
  close_connection_failed: 'Затварянето на връзката не успя',
  metric_handler_failed: 'Обратното извикване за метрики не успя',
});
