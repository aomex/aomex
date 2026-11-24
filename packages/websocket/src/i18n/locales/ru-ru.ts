import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Недопустимое имя события',
  invalid_room_name: 'Недопустимое имя комнаты',
  unknown_event: 'Неизвестное событие: {{event}}',
  handler_error: 'Не удалось обработать событие',
  duplicate_event: 'Событие уже зарегистрировано: {{event}}',
  already_attached: 'WebsocketApp уже attach, не подключайте повторно',
  transport_init_failed: 'Не удалось инициализировать транспорт WebSocket',
  handshake_failed: 'Не удалось выполнить рукопожатие WebSocket',
  accept_failed: 'Не удалось принять соединение',
  fanout_deliver_failed: 'При рассылке не удалось записать в {{failed}} соединений',
  inbound_task_failed: 'Не удалось обработать входящее событие',
  error_frame_failed: 'Не удалось отправить кадр ошибки',
  remove_client_failed: 'Не удалось удалить соединение',
  close_connection_failed: 'Не удалось закрыть соединение',
  metric_handler_failed: 'Сбой обработчика метрик',
});
