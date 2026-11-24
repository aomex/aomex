import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Жарамсыз оқиға атауы',
  invalid_room_name: 'Жарамсыз бөлме атауы',
  unknown_event: 'Белгісіз оқиға: {{event}}',
  handler_error: 'Оқиғаны өңдеу сәтсіз аяқталды',
  duplicate_event: 'Оқиға әлдеқашан тіркелген: {{event}}',
  already_attached: 'WebsocketApp әлдеқашан attach жасалған, қайта тіркемеңіз',
  transport_init_failed: 'WebSocket тасымалдауын іске қосу сәтсіз аяқталды',
  handshake_failed: 'WebSocket қол алысу сәтсіз аяқталды',
  accept_failed: 'Қосылымды қабылдау сәтсіз аяқталды',
  fanout_deliver_failed: 'Тарату кезінде {{failed}} қосылымға жазу сәтсіз аяқталды',
  inbound_task_failed: 'Кіріс оқиғасын өңдеу сәтсіз аяқталды',
  error_frame_failed: 'Қате кадрын жіберу сәтсіз аяқталды',
  remove_client_failed: 'Қосылымды жою сәтсіз аяқталды',
  close_connection_failed: 'Қосылымды жабу сәтсіз аяқталды',
  metric_handler_failed: 'Метрика кері шақыруы сәтсіз аяқталды',
});
