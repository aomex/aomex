import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bn-BD */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers খালি হতে পারে না',
  empty_broker: 'brokers-এ খালি ঠিকানা আছে',
  empty_client_id: 'clientId খালি হতে পারে না',
  empty_group_id: 'groupId খালি হতে পারে না',
  empty_topic: 'টপিকের নাম খালি হতে পারে না',
  invalid_topic_name: 'অবৈধ টপিক নাম: {{topic}}',
  topic_name_too_long: 'টপিকের নাম খুব দীর্ঘ: {{length}} > {{max}}',
  duplicate_topic: 'টপিক একাধিকবার নিবন্ধিত: {{topic}}',
  mixed_group_id: 'একটি consume কলে শুধুমাত্র একটি groupId থাকতে পারে',
  empty_consumers: 'কোনো Kafka কনজিউমার পাওয়া যায়নি',
  already_consuming: 'একটি কনজিউমার ইতিমধ্যে চলছে',
  closed: 'Kafka সংযোগ বন্ধ',
  message_too_large: 'বার্তার আকার সীমা ছাড়িয়ে গেছে: {{bytes}} > {{max}}',
  invalid_json: 'বার্তা বৈধ JSON নয়',
  empty_message: 'বার্তার বডি খালি',
  encode_failed: 'বার্তা JSON হিসেবে এনকোড করা যায়নি',
  unknown_topic: 'অসাবস্ক্রাইবড টপিক পাওয়া গেছে: {{topic}}',
  invalid_offset: 'অবৈধ বার্তা অফসেট: {{offset}}',
  idempotent_requires_all_acks: 'আইডেমপোটেন্ট প্রডিউসার চালু থাকলে acks অবশ্যই -1 হতে হবে',
  unsupported_sasl: 'অসমর্থিত SASL প্রক্রিয়া: {{mechanism}}',
  unsupported_tls: 'TLS কনফিগ ক্লায়েন্টে পাঠানো যায়নি: {{name}}',
  heartbeat_exceeds_session: 'হার্টবিট ব্যবধান সেশন টাইমআউটের চেয়ে ছোট হতে হবে',
});
