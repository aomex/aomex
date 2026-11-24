import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Недійсна назва події',
  invalid_room_name: 'Недійсна назва кімнати',
  unknown_event: 'Невідома подія: {{event}}',
  handler_error: 'Не вдалося обробити подію',
  duplicate_event: 'Подію вже зареєстровано: {{event}}',
  already_attached: 'WebsocketApp уже attach, не підключайте повторно',
  transport_init_failed: 'Не вдалося ініціалізувати транспорт WebSocket',
  handshake_failed: 'Не вдалося виконати рукостискання WebSocket',
  accept_failed: 'Не вдалося прийняти з’єднання',
  fanout_deliver_failed: 'Під час розсилання не вдалося записати в {{failed}} з’єднань',
  inbound_task_failed: 'Не вдалося обробити вхідну подію',
  error_frame_failed: 'Не вдалося надіслати кадр помилки',
  remove_client_failed: 'Не вдалося видалити з’єднання',
  close_connection_failed: 'Не вдалося закрити з’єднання',
  metric_handler_failed: 'Збій обробника метрик',
});
