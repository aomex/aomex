import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ka-GE */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'არასწორი მოვლენის სახელი',
  invalid_room_name: 'არასწორი ოთახის სახელი',
  unknown_event: 'უცნობი მოვლენა: {{event}}',
  handler_error: 'მოვლენის დამუშავება ვერ მოხერხდა',
  duplicate_event: 'მოვლენა უკვე რეგისტრირებულია: {{event}}',
  already_attached: 'WebsocketApp უკვე attach-ია, ხელახლა არ მიაბათ',
  transport_init_failed: 'WebSocket ტრანსპორტის ინიციალიზაცია ვერ მოხერხდა',
  handshake_failed: 'WebSocket ხელის ჩამორთმევა ვერ მოხერხდა',
  accept_failed: 'კავშირის მიღება ვერ მოხერხდა',
  fanout_deliver_failed: 'განაწილებისას {{failed}} კავშირზე ჩაწერა ვერ მოხერხდა',
  inbound_task_failed: 'შემომავალი მოვლენის დამუშავება ვერ მოხერხდა',
  error_frame_failed: 'შეცდომის კადრის გაგზავნა ვერ მოხერხდა',
  remove_client_failed: 'კავშირის წაშლა ვერ მოხერხდა',
  close_connection_failed: 'კავშირის დახურვა ვერ მოხერხდა',
  metric_handler_failed: 'მეტრიკის გამოძახება ვერ მოხერხდა',
});
