import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bn-BD */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'অবৈধ ইভেন্টের নাম',
  invalid_room_name: 'অবৈধ রুমের নাম',
  unknown_event: 'অজানা ইভেন্ট: {{event}}',
  handler_error: 'ইভেন্ট প্রক্রিয়াকরণ ব্যর্থ হয়েছে',
  duplicate_event: 'ইভেন্ট ইতিমধ্যে নিবন্ধিত: {{event}}',
  already_attached: 'WebsocketApp ইতিমধ্যে attach করা হয়েছে, পুনরায় মাউন্ট করবেন না',
  transport_init_failed: 'WebSocket ট্রান্সপোর্ট চালু করা যায়নি',
  handshake_failed: 'WebSocket হ্যান্ডশেক ব্যর্থ হয়েছে',
  accept_failed: 'সংযোগ গ্রহণ করা যায়নি',
  fanout_deliver_failed: 'ফ্যানআউটের সময় {{failed}}টি সংযোগে লেখা ব্যর্থ হয়েছে',
  inbound_task_failed: 'ইনবাউন্ড ইভেন্ট প্রক্রিয়া করা যায়নি',
  error_frame_failed: 'ত্রুটি ফ্রেম পাঠানো যায়নি',
  remove_client_failed: 'সংযোগ সরানো যায়নি',
  close_connection_failed: 'সংযোগ বন্ধ করা যায়নি',
  metric_handler_failed: 'মেট্রিক কলব্যাক ব্যর্থ হয়েছে',
});
